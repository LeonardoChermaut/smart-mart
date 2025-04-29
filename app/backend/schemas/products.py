from pydantic import BaseModel
from typing import Optional
from pydantic import validator
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    category_id: Optional[int] = None
    base_price: float

class ProductCreate(ProductBase):
    @validator('category_id')
    def validate_category(cls, v):
        if v is not None and v <= 0:
            raise ValueError("Category ID must be positive")
        return v

class Product(ProductBase):
    id: int
    current_price: Optional[float] = None
    class Config:
        from_attributes = True
