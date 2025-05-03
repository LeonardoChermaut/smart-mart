from datetime import datetime
from pydantic import BaseModel, Field, validator
from typing import Optional, Union
from decimal import Decimal

# Categories Schemas


class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    discount_percent: float = Field(0.0, ge=0, le=100)


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    discount_percent: Optional[float] = Field(None, ge=0, le=100)


class Category(CategoryBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Products Schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category_id: Optional[int] = None

    base_price: Union[float, Decimal, str]

    @validator('base_price')
    def convert_to_decimal(cls, v):
        if isinstance(v, str):
            try:
                return Decimal(v)
            except:
                raise ValueError("Formato de preço inválido")
        elif isinstance(v, (float, int)):
            return Decimal(str(v))
        return v


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    base_price: Optional[Union[float, Decimal, str]] = None

    @validator('base_price')
    def validate_base_price(cls, v):
        if v is not None:
            try:
                return Decimal(str(v))
            except:
                raise ValueError("Formato de preço inválido")
        return v


class Product(ProductBase):
    id: int
    current_price: float
    created_at: datetime
    updated_at: datetime
    category: Optional[Category] = None

    class Config:
        from_attributes = True

# Sales Schemas


class SaleBase(BaseModel):
    product_id: int
    date: datetime
    quantity: int = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)

    @validator('unit_price')
    def round_unit_price(cls, v):
        return round(v, 2)


class SaleCreate(SaleBase):
    pass


class SaleUpdate(BaseModel):
    product_id: Optional[int] = None
    date: Optional[datetime] = None
    quantity: Optional[int] = Field(None, gt=0)
    unit_price: Optional[float] = Field(None, gt=0)

    @validator('unit_price')
    def round_unit_price(cls, v):
        return round(v, 2) if v is not None else None


class Sale(SaleBase):
    id: int
    total_price: float
    product: Product

    class Config:
        from_attributes = True


# Analytics Schemas
class SalesAnalyticsResponse(BaseModel):
    month: str
    total_sales: float
    total_quantity: int
    profit: float
    profit_margin: Optional[float] = None

    @validator('total_sales', 'profit')
    def round_floats(cls, v):
        return round(v, 2)


class CSVUploadResponse(BaseModel):
    message: str
    records_processed: int


class MessageResponse(BaseModel):
    message: str
