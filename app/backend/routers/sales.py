from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query, status
from starlette.responses import StreamingResponse
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..service.sales import (
    get_sales_analytics,
    create_sale,
    get_sales,
    get_sale,
    update_sale,
    delete_sale,
    process_sales_csv,
    export_sales_analytics_excel,
)

from ..database.database import get_db
from ..schemas.schemas import SaleCreate, Sale, CSVUploadResponse, SalesAnalyticsResponse, SaleUpdate

router = APIRouter()


@router.post(
    "/",
    response_model=Sale,
    status_code=status.HTTP_201_CREATED
)
def create_sale_endpoint(
    sale: SaleCreate,
    db: Session = Depends(get_db)
):
    try:
        return create_sale(db=db, sale=sale)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post(
    "/upload-csv/",
    response_model=CSVUploadResponse
)
async def upload_sales_csv_endpoint(
    file: UploadFile = File(),
    db: Session = Depends(get_db)
):
    if not file.filename or not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV files are allowed"
        )

    try:
        contents = await file.read()
        records_processed = process_sales_csv(db, contents.decode('utf-8'))
        return CSVUploadResponse(
            message="CSV processed successfully",
            records_processed=records_processed
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing CSV: {str(e)}"
        )


@router.get("/", response_model=List[Sale])
def get_sales_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return get_sales(db, skip=skip, limit=limit)


@router.get("/analytics", response_model=List[SalesAnalyticsResponse])
def get_sales_analytics_endpoint(
    year: Optional[int] = Query(None, gt=2000, lt=2100),
    month: Optional[int] = Query(None, ge=1, le=12),
    category_id: Optional[int] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    try:
        return get_sales_analytics(
            db,
            year=year,
            month=month,
            category_id=category_id,
            skip=skip,
            limit=limit
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/analytics/export-excel/")
def export_excel_endpoint(
    year: Optional[str] = None,
    skip: Optional[int] = None,
    limit: Optional[int] = None,
    db: Session = Depends(get_db)
):
    return export_sales_analytics_excel(db, year=year, skip=skip, limit=limit)


@router.get("/{sale_id}", response_model=Sale)
def get_sale_endpoint(
    sale_id: int,
    db: Session = Depends(get_db)
):
    sale = get_sale(db, sale_id)
    if not sale:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sale not found"
        )
    return sale


@router.patch("/{sale_id}", response_model=Sale)
def update_sale_endpoint(
    sale_id: int,
    sale: SaleUpdate,
    db: Session = Depends(get_db)
):
    try:
        return update_sale(db, sale_id, sale)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{sale_id}", response_model=Sale)
def delete_sale_endpoint(
    sale_id: int,
    db: Session = Depends(get_db)
):
    try:
        return delete_sale(db, sale_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
