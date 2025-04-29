import io
import csv
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

from ...backend.models.products import Products
from ...backend.models.categories import Categories
from ...backend.schemas.products import ProductCreate

def create_product(db: Session, product: ProductCreate):
    current_price = product.base_price

    if product.category_id:
        db_category = db.query(Categories).filter(Categories.id == product.category_id).first()
        if not db_category:
            raise HTTPException(
                status_code=404,
                detail=f"Category with id {product.category_id} not found")

        current_price = product.base_price * (1 - db_category.discount_percent / 100)

    db_product = Products(
        name=product.name,
        category_id=product.category_id,
        base_price=product.base_price,
        current_price=current_price
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product

def get_products(db: Session, skip: int = 0, limit: int = 25):
    return db.query(Products).offset(skip).limit(limit).all()

def update_product_by_id(db: Session, product_id: int, product_data: dict):
    db_product = db.query(Products).filter(Products.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found")

    for key, value in product_data.items():
        if key != 'category_id' and key != 'base_price':
            setattr(db_product, key, value)

    if 'base_price' in product_data:
        db_product.base_price = product_data['base_price']
        if db_product.category_id is not None:
            db_category = db.query(Categories).filter(Categories.id == db_product.category_id).first()
            if db_category:
                db_product.current_price = db_product.base_price * (1 - db_category.discount_percent / 100)
            else:
                db.query(Products).filter(Products.id == product_id).update({"category_id": None})
                db_product.current_price = db_product.base_price
        else:
            db_product.current_price = db_product.base_price

    if 'category_id' in product_data:
        new_category_id = product_data['category_id']

        if new_category_id is None:
            db.query(Products).filter(Products.id == product_id).update({
                "category_id": None,
                "current_price": db_product.base_price
            })
        else:
            db_category = db.query(Categories).filter(Categories.id == new_category_id).first()
            if not db_category:
                raise HTTPException(
                    status_code=404,
                    detail=f"Category with id {new_category_id} not found"
                )

            db.query(Products).filter(Products.id == product_id).update({
                "category_id": new_category_id,
                "current_price": db_product.base_price * (1 - db_category.discount_percent / 100)
            })

    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product_by_id(db: Session, product_id: int):
    db_product = db.query(Products).filter(Products.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found")

    db.delete(db_product)
    db.commit()
    return db_product

def delete_products_by_category_id(db: Session, category_id: int):
    db_products = db.query(Products).filter(Products.category_id == category_id).all()
    if not db_products:
        raise HTTPException(
            status_code=404,
            detail=f"No products found in category with id {category_id}"
        )

    for product in db_products:
        db.delete(product)

    db.commit()
    return db_products

def process_csv_upload_products(db: Session, decoded_csv: str):
    records_processed = 0
    csv_reader = csv.DictReader(io.StringIO(decoded_csv))

    for row in csv_reader:
        try:
            name = row.get("name", "").strip()
            if not name:
                print(f"Missing name in row: {row}")
                continue

            category_id = None
            if 'category_id' in row and row['category_id']:
                try:
                    category_id = int(row['category_id'])
                    if category_id <= 0:
                        print(f"Invalid category ID in row: {row}")
                        continue

                    category = db.query(Categories).filter(Categories.id == category_id).first()
                    if not category:
                        print(f"Category ID {category_id} not found - product will be created without discount")
                        category_id = None
                except (ValueError, TypeError):
                    print(f"Invalid category_id format in row: {row}")
                    category_id = None

            try:
                base_price = float(row.get('base_price', 0))
                if base_price <= 0:
                    print(f"Invalid base_price in row: {row}")
                    continue
            except (ValueError, TypeError):
                print(f"Invalid base_price in row: {row}")
                continue

            current_price = base_price
            if category_id:
                category = db.query(Categories).filter(Categories.id == category_id).first()
                if category:
                    current_price = base_price * (1 - category.discount_percent / 100)

            existing_product = db.query(Products).filter(
                Products.name == name,
                Products.category_id == (category_id if category_id else None)
            ).first()

            if existing_product:
                print(f"Product already exists: {name}")
                continue

            db_product = Products(
                name=name,
                category_id=category_id,
                base_price=base_price,
                current_price=current_price
            )
            db.add(db_product)
            records_processed += 1

        except Exception as e:
            print(f"Error processing row: {row} - Error: {str(e)}")
            continue

    try:
        db.commit()
        return records_processed
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Database integrity error: {str(e)}"
        )