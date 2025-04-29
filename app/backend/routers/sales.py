from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ...backend.service.sales import (
    get_sales_analytics_service,
    create_sale_service,
    get_sales_service,
    update_sale_by_id_service,
    delete_sale_by_id_service,
    process_csv_upload_sales_service,
    export_sales_analytics_csv_service
)
from ...backend.database.database import get_db
from ...backend.schemas.sales import SaleCreate, Sale, CSVUploadResponse, SalesAnalyticsResponse

router = APIRouter()

@router.get("/analytics", response_model=list[SalesAnalyticsResponse])
def read_sales_analytics(
    year: Optional[int] = Query(None, description="Filtrar por ano"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return get_sales_analytics_service(db, year=str(year) if year else None, skip=skip, limit=limit)

@router.post("/", response_model=Sale)
def create_sale_endpoint(
    sale: SaleCreate,
    db: Session = Depends(get_db)
):
    return create_sale_service(db=db, sale=sale)

@router.get("/analytics/export-excel/")
def export_sales_analytics_excel_endpoint(
    year: Optional[int] = Query(None, description="Filtrar por ano"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return export_sales_analytics_csv_service(db, year=str(year) if year else None, skip=skip, limit=limit)

@router.get("/", response_model=List[Sale])
def read_sales(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    return get_sales_service(db, skip=skip, limit=limit)

@router.patch("/{sale_id}", response_model=Sale)
def update_sale_endpoint(
    sale_id: int,
    sale_update: dict,
    db: Session = Depends(get_db)
):
    return update_sale_by_id_service(db, sale_id, sale_update)

@router.delete("/{sale_id}", response_model=Sale)
def delete_sale_endpoint(
    sale_id: int,
    db: Session = Depends(get_db)
):
    return delete_sale_by_id_service(db, sale_id)

@router.post("/upload-csv/", response_model=CSVUploadResponse)
async def upload_sales_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename or not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    contents = await file.read()
    records_processed = process_csv_upload_sales_service(db, contents.decode('utf-8'))

    return {
        "message": "CSV processed successfully",
        "records_processed": records_processed
    }
