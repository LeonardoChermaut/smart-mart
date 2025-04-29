from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ...backend.database.database import Base
from ...backend.models.products import Products

class Categories(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(unique=True, index=True)
    discount_percent: Mapped[float] = mapped_column(default=0.0)
    products: Mapped[list["Products"]] = relationship("Products", back_populates="category")
