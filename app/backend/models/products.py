from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from ...backend.database.database import Base

class Products(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    base_price = Column(Float, nullable=False)
    current_price = Column(Float)
    category = relationship("Categories", back_populates="products")
    sales = relationship("Sales", back_populates="product")