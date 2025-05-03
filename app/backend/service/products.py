from decimal import Decimal, InvalidOperation
from datetime import datetime
import io
import csv
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql import func
from fastapi import HTTPException, status
from typing import Optional, List

from ..models.models import Products, Categories
from ..schemas.schemas import ProductCreate, ProductUpdate


def create_product(db: Session, product: ProductCreate):
    try:
        base_price = product.base_price if isinstance(
            product.base_price, Decimal) else Decimal(str(product.base_price))

        current_price = base_price
        if product.category_id:
            category = db.query(Categories).filter(
                Categories.id == product.category_id).first()
            if category:
                discount = Decimal(
                    str(category.discount_percent)) / Decimal(100)
                current_price = base_price * (Decimal(1) - discount)

        db_product = Products(
            name=product.name,
            description=product.description,
            category_id=product.category_id,
            base_price=base_price,
            current_price=current_price
        )

        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product

    except InvalidOperation as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Valor monetário inválido: {str(e)}"
        )


def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[Products]:
    return db.query(Products).offset(skip).limit(limit).all()


def get_product(db: Session, product_id: int) -> Optional[Products]:
    return db.query(Products).filter(Products.id == product_id).first()


def update_product(db: Session, product_id: int, product_update: ProductUpdate):
    db_product = db.query(Products).filter(Products.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    try:
        update_data = product_update.dict(exclude_unset=True)

        if 'base_price' in update_data:
            if isinstance(update_data['base_price'], (str, float)):
                update_data['base_price'] = Decimal(
                    str(update_data['base_price']))

        if 'base_price' in update_data or 'category_id' in update_data:
            base_price = update_data.get('base_price', db_product.base_price)
            category_id = update_data.get(
                'category_id', db_product.category_id)

            current_price = base_price
            if category_id:
                category = db.query(Categories).filter(
                    Categories.id == category_id).first()
                if category:
                    discount = Decimal(
                        str(category.discount_percent)) / Decimal(100)
                    current_price = base_price * (Decimal(1) - discount)

            update_data['current_price'] = current_price

        for field, value in update_data.items():
            setattr(db_product, field, value)

        db.commit()
        db.refresh(db_product)
        return db_product

    except InvalidOperation as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Valor monetário inválido: {str(e)}"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Erro ao atualizar produto: {str(e)}"
        )


def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    db.delete(db_product)
    db.commit()
    return db_product


def process_products_csv(db: Session, file_content: str) -> int:
    records_processed = 0
    csv_reader = csv.DictReader(io.StringIO(file_content))

    for row in csv_reader:
        try:
            if not row.get('name') or not row.get('base_price'):
                continue

            category_id = None
            if row.get('category_id', '').strip():
                try:
                    category_id = int(row['category_id'])
                    if not db.query(Categories).filter(Categories.id == category_id).first():
                        category_id = None
                except (ValueError, TypeError):
                    category_id = None

            try:
                base_price = Decimal(row['base_price'])
                if base_price <= 0:
                    continue
            except (ValueError, TypeError, InvalidOperation):
                continue

            current_price = base_price
            if category_id:
                category = db.query(Categories).filter(
                    Categories.id == category_id).first()
                if category:
                    discount = Decimal(
                        str(category.discount_percent)) / Decimal(100)
                    current_price = base_price * (Decimal(1) - discount)

            existing_product = db.query(Products).filter(
                func.lower(Products.name) == func.lower(row['name'].strip())
            ).first()

            if existing_product:
                continue

            new_product = Products(
                name=row['name'].strip(),
                description=row.get('description', '').strip(),
                category_id=category_id,
                base_price=float(base_price),
                current_price=float(current_price),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )

            db.add(new_product)
            records_processed += 1

        except Exception as e:
            print(f"Error processing product row: {row}. Error: {str(e)}")
            continue

    try:
        db.commit()
        return records_processed
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Database integrity error: {str(e)}"
        )


# TODO: Mover para helpers ou utils
def get_category(db: Session, category_id: int) -> Optional[Categories]:
    return db.query(Categories).filter(Categories.id == category_id).first()
