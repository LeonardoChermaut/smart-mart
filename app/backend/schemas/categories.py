from pydantic import BaseModel
from pydantic import validator

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    discount_percent: float = 0.0

class Category(CategoryBase):
    id: int
    discount_percent: float = 0.0
    class Config:
        from_attributes = True

class CategoryDiscountUpdate(BaseModel):
    discount_percent: float