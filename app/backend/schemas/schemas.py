from pydantic import BaseModel
from typing import Optional
from pydantic import validator
from datetime import datetime









class SalesAnalyticsResponse(BaseModel):
  month: str
  total_sales: float
  total_quantity: int
  profit: float

class SaleBase(BaseModel):
    product_id: int
    date: str
    quantity: int
    total_price: float

    @validator('date')
    def validate_date(cls, v):
        date_formats = ['%Y-%m-%d', '%m/%d/%Y', '%d/%m/%Y']
        for fmt in date_formats:
            try:
                parsed_date = datetime.strptime(v, fmt).date()
                return parsed_date.isoformat()
            except ValueError:
                continue
        raise ValueError("Invalid date format. Expected one of: YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY.")

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    id: int
    class Config:
        from_attributes = True

class CSVUploadResponse(BaseModel):
    message: str
    records_processed: int