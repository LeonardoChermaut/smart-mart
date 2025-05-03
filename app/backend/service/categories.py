from datetime import datetime
import csv
import io
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from fastapi import HTTPException, status

from ..models.models import Categories
from ..schemas.schemas import CategoryCreate, CategoryUpdate


def create_category(db: Session, category: CategoryCreate):
    db_category = Categories(
        name=category.name,
        discount_percent=category.discount_percent,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def get_categories(db: Session, skip: int = 0, limit: int = 100) -> List[Categories]:
    return db.query(Categories).offset(skip).limit(limit).all()


def get_category(db: Session, category_id: int) -> Optional[Categories]:
    return db.query(Categories).filter(Categories.id == category_id).first()


def update_category(db: Session, category_id: int, category: CategoryUpdate):
    db_category = get_category(db, category_id)
    if not db_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    update_data = category.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_category, field, value)

    db.commit()
    db.refresh(db_category)
    return db_category


def delete_category(db: Session, category_id: int):
    db_category = get_category(db, category_id)
    if not db_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    db.delete(db_category)
    db.commit()
    return db_category


def process_categories_csv(db: Session, file_content: str) -> int:
    records_processed = 0
    csv_reader = csv.DictReader(io.StringIO(file_content))

    for row in csv_reader:
        try:
            if not row.get('name'):
                continue

            discount_str = row.get('discount_percent', '0').strip()
            try:
                discount = float(discount_str.replace(
                    '%', '')) if '%' in discount_str else float(discount_str)
                discount = max(0.0, min(100.0, discount))
            except (ValueError, TypeError):
                discount = 0.0

            existing_category = db.query(Categories).filter(
                func.lower(Categories.name) == func.lower(row['name'].strip())
            ).first()

            if existing_category:
                continue

            new_category = Categories(
                name=row['name'].strip(),
                discount_percent=discount
            )

            db.add(new_category)
            records_processed += 1

        except Exception as e:
            print(f"Error processing category row: {row}. Error: {str(e)}")
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
