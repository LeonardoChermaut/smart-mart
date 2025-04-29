import csv
import io
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from typing import Optional
import pandas as pd
from io import BytesIO
from ...backend.models.sales import Sales
from ...backend.models.products import Products
from ...backend.models.categories import Categories
from ...backend.schemas.sales import SaleCreate, SalesAnalyticsResponse

def get_sales_analytics_service(db: Session, year: Optional[str] = None, skip: Optional[int] = None, limit: Optional[int] = None):
    months = [f"{year}-{str(month).zfill(2)}" for month in range(1, 13)] if year else []

    query = db.query(
        func.strftime("%Y-%m", Sales.date).label("month"),
        func.sum(Sales.total_price).label("total_sales"),
        func.sum(Sales.quantity).label("total_quantity"),
        func.sum(
            Sales.total_price - (Sales.quantity * Products.base_price * (1 - Categories.discount_percent / 100))
        ).label("profit")
    ).join(Products, Sales.product_id == Products.id).join(Categories, Products.category_id == Categories.id)

    if year:
        query = query.filter(Sales.date.startswith(year))

    query = query.group_by(func.strftime("%Y-%m", Sales.date))
    results = query.all()

    all_months = {month: {"total_sales": 0.0, "total_quantity": 0, "profit": 0.0} for month in months}

    for month, total_sales, total_quantity, profit in results:
        all_months[month] = {
            "total_sales": float(total_sales) if total_sales else 0.0,
            "total_quantity": int(total_quantity) if total_quantity else 0,
            "profit": float(profit) if profit else 0.0,
        }

    return [
        SalesAnalyticsResponse(
            month=month,
            total_sales=data["total_sales"],
            total_quantity=data["total_quantity"],
            profit=data["profit"]
        )
        for month, data in all_months.items()
    ][(skip or 0): (skip or 0) + (limit or len(all_months))]

def create_sale_service(db: Session, sale: SaleCreate):
    db_product = db.query(Products).filter(Products.id == sale.product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail=f"Product with id {sale.product_id} not found")

    db_sale = Sales(
        product_id=sale.product_id,
        date=sale.date,
        quantity=sale.quantity,
        total_price=sale.total_price
    )

    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    return db_sale

def get_sales_service(db: Session, skip: int = 0, limit: int = 30):
    return db.query(Sales).offset(skip).limit(limit).all()

def update_sale_by_id_service(db: Session, sale_id: int, sale_data: dict):
    db_sale = db.query(Sales).filter(Sales.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail=f"Sale with id {sale_id} not found")

    for key, value in sale_data.items():
        setattr(db_sale, key, value)

    db.commit()
    db.refresh(db_sale)
    return db_sale

def delete_sale_by_id_service(db: Session, sale_id: int):
    db_sale = db.query(Sales).filter(Sales.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail=f"Sale with id {sale_id} not found")

    db.delete(db_sale)
    db.commit()
    return db_sale

def process_csv_upload_sales_service(db: Session, decoded_csv: str):
    records_processed = 0
    csv_reader = csv.DictReader(io.StringIO(decoded_csv))

    for row in csv_reader:
        try:
            product_id = int(row.get('product_id', 0))
            if product_id <= 0:
                print(f"Invalid product_id in row: {row}")
                continue

            db_product = db.query(Products).filter(Products.id == product_id).first()
            if not db_product:
                print(f"Product ID {product_id} not found in row: {row}")
                continue

            date = row.get("date", "").strip()
            if not date:
                print(f"Missing date in row: {row}")
                continue

            try:
                quantity = int(row.get('quantity', 0))
                if quantity <= 0:
                    print(f"Invalid quantity in row: {row}")
                    continue
            except (ValueError, TypeError):
                print(f"Invalid quantity in row: {row}")
                continue

            try:
                total_price = float(row.get('total_price', 0))
                if total_price <= 0:
                    print(f"Invalid total_price in row: {row}")
                    continue
            except (ValueError, TypeError):
                print(f"Invalid total_price in row: {row}")
                continue

            existing_sale = db.query(Sales).filter(Sales.product_id == product_id, Sales.date == date).first()
            if existing_sale:
                print(f"Sale already exists for product {product_id} on date {date}")
                continue

            db_sale = Sales(
                product_id=product_id,
                date=date,
                quantity=quantity,
                total_price=total_price
            )
            db.add(db_sale)
            records_processed += 1

        except Exception as e:
            print(f"Error processing row: {row} - Error: {str(e)}")
            continue

    try:
        db.commit()
        return records_processed
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database integrity error: {str(e)}")

def export_sales_analytics_csv_service(db: Session, year: Optional[str] = None, skip: Optional[int] = None, limit: Optional[int] = None):
    sales_analytics_data = get_sales_analytics_service(db, year=year, skip=skip, limit=limit)

    output = io.StringIO()
    writer = csv.writer(output, delimiter=',', quoting=csv.QUOTE_MINIMAL)

    writer.writerow(["Mês", "Total Vendas (R$)", "Quantidade", "Lucro (R$)"])

    for data in sales_analytics_data:
        writer.writerow([
            data.month,
            f"{data.total_sales:.2f}".replace(".", ","),
            data.total_quantity,
            f"{data.profit:.2f}".replace(".", ",")
        ])

    output.seek(0)
    return output.getvalue()
