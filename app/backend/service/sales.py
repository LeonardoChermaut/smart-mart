from typing import Optional
from fastapi.responses import StreamingResponse
from sqlalchemy import func, and_, extract
from sqlalchemy import Integer
from sqlalchemy.sql.expression import cast
from datetime import datetime
import csv
import io
from sqlalchemy.orm import Session
from sqlalchemy.sql import func, case, and_
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from typing import Optional, List
import pandas as pd
from io import BytesIO

from ..models.models import Sales, Products
from ..schemas.schemas import SaleCreate, SaleUpdate, SalesAnalyticsResponse


def create_sale(db: Session, sale: SaleCreate):
    db_product = db.query(Products).filter(
        Products.id == sale.product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    total_price = sale.quantity * sale.unit_price

    db_sale = Sales(
        **sale.model_dump(),
        total_price=round(total_price, 2)
    )

    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale


def get_sales(db: Session, skip: int = 0, limit: int = 100) -> List[Sales]:
    return db.query(Sales).offset(skip).limit(limit).all()


def get_sale(db: Session, sale_id: int) -> Optional[Sales]:
    return db.query(Sales).filter(Sales.id == sale_id).first()


def update_sale(db: Session, sale_id: int, sale: SaleUpdate):
    db_sale = get_sale(db, sale_id)
    if not db_sale:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sale not found"
        )

    update_data = sale.model_dump(exclude_unset=True)

    if 'quantity' in update_data or 'unit_price' in update_data:
        quantity = update_data.get('quantity', db_sale.quantity)
        unit_price = update_data.get('unit_price', db_sale.unit_price)
        update_data['total_price'] = round(quantity * unit_price, 2)

    for field, value in update_data.items():
        setattr(db_sale, field, value)

    db.commit()
    db.refresh(db_sale)
    return db_sale


def delete_sale(db: Session, sale_id: int):
    db_sale = get_sale(db, sale_id)
    if not db_sale:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sale not found"
        )

    db.delete(db_sale)
    db.commit()
    return db_sale


def get_sales_analytics(
    db: Session,
    year: Optional[int] = None,
    month: Optional[int] = None,
    category_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100
) -> List[SalesAnalyticsResponse]:

    filters = []
    if year:
        filters.append(cast(func.strftime('%Y', Sales.date), Integer) == year)
    if month:
        filters.append(cast(func.strftime('%m', Sales.date), Integer) == month)
    if category_id:
        filters.append(Products.category_id == category_id)

    query = db.query(
        func.strftime('%Y-%m', Sales.date).label("month"),
        func.sum(Sales.total_price).label("total_sales"),
        func.sum(Sales.quantity).label("total_quantity"),
        func.sum(Sales.total_price - (Sales.quantity *
                 Products.base_price * 0.8)).label("profit"),
        (func.sum(Sales.total_price - (Sales.quantity * Products.base_price * 0.8)) /
         func.nullif(func.sum(Sales.total_price), 0) * 100).label("profit_margin")
    ).join(Products)

    if filters:
        query = query.filter(and_(*filters))

    query = query.group_by(func.strftime('%Y-%m', Sales.date))

    query = query.order_by(func.strftime('%Y-%m', Sales.date))

    results = query.offset(skip).limit(limit).all()

    return [
        SalesAnalyticsResponse(
            month=row.month,
            total_sales=row.total_sales or 0.0,
            total_quantity=row.total_quantity or 0,
            profit=row.profit or 0.0,
            profit_margin=row.profit_margin or 0.0
        )
        for row in results
    ]


def process_sales_csv(db: Session, file_content: str) -> int:
    records_processed = 0

    csv_file = io.StringIO(file_content)

    dialect = csv.Sniffer().sniff(csv_file.read(1024))
    csv_file.seek(0)

    try:
        csv_reader = csv.DictReader(csv_file, dialect=dialect)
        if not csv_reader.fieldnames:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="O arquivo CSV não contém cabeçalhos válidos"
            )

        fieldnames = [field.strip().lower() for field in csv_reader.fieldnames]
        csv_reader.fieldnames = fieldnames
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao ler o arquivo CSV: {str(e)}"
        )

    for row in csv_reader:
        try:

            print(f"Processando linha: {row}")

            required_fields = {'product_id', 'date', 'quantity', 'unit_price'}
            if not required_fields.issubset({f.lower() for f in row.keys()}):
                print(f"Campos faltando na linha: {row.keys()}")
                continue

            try:
                product_id = int(row['product_id'])
                product = db.query(Products).filter(
                    Products.id == product_id).first()
                if not product:
                    print(f"Produto não encontrado: ID {product_id}")
                    continue
            except (ValueError, TypeError):
                print(f"ID de produto inválido: {row['product_id']}")
                continue

            try:
                date_str = row['date'].strip()

                date_formats = [
                    '%Y-%m-%d %H:%M:%S',
                    '%Y-%m-%dT%H:%M:%S',
                    '%Y-%m-%d %H:%M',
                    '%Y-%m-%dT%H:%M',
                    '%Y-%m-%d'
                ]

                sale_date = None
                for fmt in date_formats:
                    try:
                        sale_date = datetime.strptime(date_str, fmt)
                        break
                    except ValueError:
                        continue

                if not sale_date:
                    print(f"Formato de data inválido: {date_str}")
                    continue

            except KeyError:
                print("Campo 'date' não encontrado")
                continue

            try:
                quantity = int(row['quantity'])
                if quantity <= 0:
                    print(f"Quantidade inválida: {quantity}")
                    continue
            except (ValueError, TypeError):
                print(f"Quantidade inválida: {row['quantity']}")
                continue

            try:
                unit_price = float(row['unit_price'])
                if unit_price <= 0:
                    print(f"Preço unitário inválido: {unit_price}")
                    continue
            except (ValueError, TypeError):
                print(f"Preço unitário inválido: {row['unit_price']}")
                continue

            existing_sale = db.query(Sales).filter(
                Sales.product_id == product_id,
                Sales.date == sale_date
            ).first()

            if existing_sale:
                print(
                    f"Venda duplicada para produto {product_id} em {sale_date}")
                continue

            new_sale = Sales(
                product_id=product_id,
                date=sale_date,
                quantity=quantity,
                unit_price=unit_price,
                total_price=quantity * unit_price
            )

            db.add(new_sale)
            records_processed += 1
            print(f"Venda processada com sucesso: {new_sale}")

        except Exception as e:
            print(f"Erro ao processar linha {row}: {str(e)}")
            continue

    try:
        db.commit()
        print(
            f"Total de registros processados com sucesso: {records_processed}")
        return records_processed
    except Exception as e:
        db.rollback()
        print(f"Erro no commit: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao salvar no banco de dados: {str(e)}"
        )


def export_sales_analytics_excel(db: Session, year: Optional[str] = None,
                                 skip: Optional[int] = None, limit: Optional[int] = None) -> StreamingResponse:
    query = db.query(
        func.strftime('%Y-%m', Sales.date).label("month"),
        func.sum(Sales.total_price).label("total_sales"),
        func.sum(Sales.quantity).label("total_quantity"),
        func.sum(Sales.total_price - (Sales.quantity *
                 Products.base_price * 0.8)).label("profit")
    ).join(Products)

    if year:
        query = query.filter(func.strftime('%Y', Sales.date) == str(year))

    results = query.group_by(func.strftime(
        '%Y-%m', Sales.date)).order_by(func.strftime('%Y-%m', Sales.date))

    if skip is not None and limit is not None:
        results = results.offset(skip).limit(limit)

    sales_data = results.all()

    formatted_data = [{
        'Mês': month,
        'Total Vendas (R$)': f"R$ {total_sales:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."),
        'Quantidade': f"{total_quantity:,}".replace(",", "."),
        'Lucro (R$)': f"R$ {profit:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."),
        'Margem (%)': f"{(profit / total_sales * 100) if total_sales else 0:.2f}%"
    } for month, total_sales, total_quantity, profit in sales_data]

    output = BytesIO()
    df = pd.DataFrame(formatted_data)

    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Vendas', index=False)

    output.seek(0)

    filename = f"relatorio_vendas_{year or 'completo'}_{datetime.now().strftime('%Y%m%d')}.xlsx"

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
