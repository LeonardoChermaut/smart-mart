
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Body
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import csv
import io
import tempfile
from typing import List

from ...backend.service.products import (
    create_product,
    get_products,
    process_csv_upload_products,
    delete_products_by_category_id,
    delete_product_by_id,
    update_product_by_id,
)
from ...backend.database.database import get_db
from ...backend.schemas.products import (
    ProductCreate,
    Product,
)

from ...backend.schemas.sales import CSVUploadResponse

router = APIRouter()

@router.post("/", response_model=Product)
def create_product_endpoint(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    return create_product(db=db, product=product)

@router.post("/upload-csv/", response_model=CSVUploadResponse)
async def upload_products_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename or not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    contents = await file.read()
    records_processed = process_csv_upload_products(db, contents.decode('utf-8'))

    return {
        "message": "CSV processed successfully",
        "records_processed": records_processed
    }

@router.patch("/{product_id}", response_model=Product)
def update_product_endpoint(
    product_id: int,
    product_update: dict = Body(...),
    db: Session = Depends(get_db)
):
    try:
        return update_product_by_id(db, product_id, product_update)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error updating product: {str(e)}"
        )

@router.get("/", response_model=List[Product])
def read_products(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    return get_products(db, skip=skip, limit=limit)

@router.get("/export-csv/")
def export_products_csv(db: Session = Depends(get_db)):
    products = get_products(db)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "name", "category_id", "base_price"])
    for product in products:
        writer.writerow([
            product.id,
            product.name,
            product.category_id,
            product.base_price
        ])
    output.seek(0)

    with tempfile.NamedTemporaryFile(delete=False, mode='w', suffix='.csv') as temp_file:
        temp_file.write(output.getvalue())
        temp_file_path = temp_file.name

    return FileResponse(
        temp_file_path,
        media_type="text/csv",
        filename="products_export.csv"
    )

@router.delete("/{product_id}", response_model=Product)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    try:
        return delete_product_by_id(db, product_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error deleting product: {str(e)}"
        )

@router.delete("/category/{category_id}", response_model=List[Product])
def delete_products_by_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    try:
        return delete_products_by_category_id(db, category_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error deleting products by category: {str(e)}"
        )