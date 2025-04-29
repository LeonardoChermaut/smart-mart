import csv
import io
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

from ...backend.models.categories import Categories
from ...backend.models.products import Products
from ...backend.schemas.categories import CategoryCreate

def create_category(db: Session, category: CategoryCreate):
    db_category = Categories(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_categories(db: Session):
    return db.query(Categories).all()

def update_category_discount(db: Session, category_id: int, discount_percent: float):
    db_category = db.query(Categories).filter(Categories.id == category_id).first()
    if not db_category:
        return None

    db.query(Categories).filter(Categories.id == category_id).update({"discount_percent": discount_percent})
    products = db.query(Products).filter(Products.category_id == category_id).all()

    for product in products:
        db.query(Products).filter(Products.id == product.id).update({
            "current_price": product.base_price * (1 - discount_percent / 100)
        })

    db.commit()
    db.refresh(db_category)
    return db_category

def update_category_by_id(db: Session, category_id: int, category_data: dict):
    db_category = db.query(Categories).filter(Categories.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail=f"Category with id {category_id} not found")

    for key, value in category_data.items():
        setattr(db_category, key, value)

    db.commit()
    db.refresh(db_category)
    return db_category

def delete_category_by_id(db: Session, category_id: int):
    db_category = db.query(Categories).filter(Categories.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail=f"Category with id {category_id} not found")

    db.query(Products).filter(Products.category_id == category_id).update(
        {"category_id": None}
    )

    db.delete(db_category)
    db.commit()

    return db_category

def convert_discount_percent(value):
    """Convert discount_percent value to decimal number."""
    if isinstance(value, str):
        if '%' in value:
            value = value.replace('%', '')
            try:
                return float(value) / 100
            except ValueError:
                print(f"Invalid value for discount_percent: {value}")
                return None
        else:
            try:
                return float(value)
            except ValueError:
                print(f"Invalid value for discount_percent: {value}")
                return None
    elif isinstance(value, (int, float)):
        return float(value)
    return None

def process_csv_upload_categories(db: Session, decoded_csv: str):
    records_processed = 0
    csv_reader = csv.DictReader(io.StringIO(decoded_csv))

    for row in csv_reader:
        name = row.get("name")
        if not name:
            print(f"Missing name for category: {row}")
            continue

        discount_percent = row.get("discount_percent")
        if discount_percent:
            discount_percent = convert_discount_percent(discount_percent)
            if discount_percent is None:
                print(f"Invalid discount for category {name}: {row['discount_percent']}")
                continue

        existing_category = db.query(Categories).filter(Categories.name == name).first()
        if existing_category:
            print(f"Category already exists: {name}")
            continue

        new_category = Categories(
            name=name,
            discount_percent=discount_percent if discount_percent is not None else 0
        )
        db.add(new_category)
        records_processed += 1

    try:
        db.commit()
    except IntegrityError:
        db.rollback()

    return records_processed