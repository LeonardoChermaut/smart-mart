
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List

from ...backend.service.categories import (
    create_category,
    get_categories,
    update_category_discount,
    update_category_by_id,
    process_csv_upload_categories,
    delete_category_by_id,
)

from ...backend.database.database import get_db

from ...backend.schemas.categories import (
    CategoryCreate,
    Category,
    CategoryDiscountUpdate,
)

from ...backend.schemas.sales import CSVUploadResponse

router = APIRouter()

@router.post("/", response_model=Category)
def create_category_endpoint(
    category: CategoryCreate,
    db: Session = Depends(get_db)
):
    return create_category(db=db, category=category)

@router.post("/upload-csv/", response_model=CSVUploadResponse)
async def upload_categories_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename or not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    contents = await file.read()

    try:
        decoded = contents.decode('utf-8')
    except UnicodeDecodeError:
        decoded = contents.decode('latin1')

    records_processed = process_csv_upload_categories(db, decoded)

    return {
        "message": "CSV processed successfully",
        "records_processed": records_processed
    }

@router.get("/", response_model=List[Category])
def read_categories(db: Session = Depends(get_db)):
    return get_categories(db=db)

@router.patch("/{category_id}/discount", response_model=Category)
def update_category_discount_endpoint(
    category_id: int,
    discount_update: CategoryDiscountUpdate,
    db: Session = Depends(get_db)
):
    return update_category_discount(
        db=db,
        category_id=category_id,
        discount_percent=discount_update.discount_percent
    )

@router.patch("/{category_id}", response_model=Category)
def update_category_endpoint(
    category_id: int,
    category_update: dict = Body(...),
    db: Session = Depends(get_db)
):
    try:
        return update_category_by_id(db, category_id, category_update)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error updating category: {str(e)}"
        )

@router.delete("/{category_id}", response_model=Category)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    try:
        return delete_category_by_id(db, category_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error deleting category: {str(e)}"
        )