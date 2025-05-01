from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from ...backend.database.database import Base


class Sales(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    date = Column(String, nullable=False)
    quantity = Column(Integer)
    total_price = Column(Float)
    product = relationship("Products", back_populates="sales")
