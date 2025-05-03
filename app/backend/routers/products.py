
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Body, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import csv
import io
import tempfile
from typing import List
from datetime import datetime

from ..service.products import (
    create_product,
    get_products,
    process_products_csv,
    delete_product,
    delete_product,
    update_product,
)

from ..database.database import get_db
from ..schemas.schemas import (
    ProductCreate,
    Product,
    ProductUpdate,
)

from ..schemas.schemas import CSVUploadResponse

router = APIRouter()


@router.post(
    "/",
    response_model=Product,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new product",
    responses={
        400: {"description": "Invalid data"},
        404: {"description": "Category not found"}
    }
)
def create_product_endpoint(
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    try:
        return create_product(db=db, product=product)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating product: {str(e)}"
        )


@router.post(
    "/upload-csv/",
    response_model=CSVUploadResponse,
    summary="Upload products via CSV",
    responses={
        400: {"description": "Invalid file format or data"}
    }
)
async def upload_products_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    if not file.filename or not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV files are allowed"
        )

    try:
        contents = await file.read()
        records_processed = process_products_csv(
            db, contents.decode('utf-8'))

        return CSVUploadResponse(
            message="CSV processed successfully",
            records_processed=records_processed
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing CSV: {str(e)}"
        )


@router.patch(
    "/{product_id}",
    response_model=Product,
    summary="Update a product",
    responses={
        400: {"description": "Invalid data"},
        404: {"description": "Product not found"}
    }
)
def update_product_endpoint(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db)
):

    try:
        return update_product(db, product_id, product_update)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error updating product: {str(e)}"
        )


@router.get(
    "/",
    response_model=List[Product],
    summary="List all products",
    response_description="A list of products"
)
def read_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):

    return get_products(db, skip=skip, limit=limit)


@router.get(
    "/export-csv/",
    response_class=FileResponse,
    summary="Export products to CSV"
)
def export_products_csv(db: Session = Depends(get_db)):
    try:
        products = get_products(db)

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "id", "name", "description",
            "category_id", "base_price", "current_price",
            "created_at", "updated_at"
        ])

        for product in products:
            writer.writerow([
                product.id,
                product.name,
                product.description,
                product.category_id,
                product.base_price,
                product.current_price,
                product.created_at.isoformat() if product.created_at else "",
                product.updated_at.isoformat() if product.updated_at else ""
            ])

        output.seek(0)

        with tempfile.NamedTemporaryFile(delete=False, mode='w', suffix='.csv') as temp_file:
            temp_file.write(output.getvalue())
            temp_file_path = temp_file.name

        return FileResponse(
            temp_file_path,
            media_type="text/csv",
            filename=f"products_export_{datetime.now().strftime('%Y%m%d')}.csv"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating CSV: {str(e)}"
        )


@router.delete(
    "/{product_id}",
    response_model=Product,
    summary="Delete a product",
    responses={
        404: {"description": "Product not found"}
    }
)
def delete_product_endpoint(
    product_id: int,
    db: Session = Depends(get_db)
):
    try:
        return delete_product(db, product_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error deleting product: {str(e)}"
        )
