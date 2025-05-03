from datetime import datetime
from sqlalchemy import Integer, String, ForeignKey, DateTime, Index, Numeric, Column, func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from typing import Optional
from decimal import Decimal

from ...backend.database.database import Base


class Categories(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False)
    discount_percent: Mapped[float] = mapped_column(Numeric(5, 2), default=0.0)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    products: Mapped[list["Products"]] = relationship(
        "Products",
        back_populates="category",
        cascade="all, delete-orphan",
        lazy="selectin"
    )

    def __repr__(self):
        return f"<Category {self.name} (ID: {self.id})>"


class Products(Base):
    __tablename__ = "products"
    __table_args__ = (
        Index('idx_product_name', 'name'),
        Index('idx_product_category', 'category_id'),
        {'comment': 'Tabela de produtos do sistema'}
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    description: Mapped[str] = mapped_column(
        String(500), nullable=True)
    category_id: Mapped[int] = mapped_column(
        Integer,

        ForeignKey("categories.id", ondelete="CASCADE"),
        nullable=True
    )
    base_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    current_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category: Mapped[Optional["Categories"]] = relationship(
        "Categories",
        back_populates="products",
        lazy="joined"
    )

    sales: Mapped[list["Sales"]] = relationship(
        "Sales",
        back_populates="product",
        cascade="all, delete-orphan",
        lazy="dynamic"
    )

    def __repr__(self):
        return f"<Product {self.name} (ID: {self.id})>"

    def validate_prices(self):
        """Valida se o preço atual respeita o desconto máximo da categoria"""
        if self.category and self.current_price < (self.base_price * (Decimal(1) - Decimal(self.category.discount_percent) / Decimal(100))):
            raise ValueError(
                "Preço atual viola o desconto máximo permitido para esta categoria")


class Sales(Base):
    __tablename__ = "sales"
    __table_args__ = (
        Index('idx_sales_date', 'date'),
        Index('idx_sales_product', 'product_id'),
        {'comment': 'Registros de vendas de produtos'}
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(
        Integer,

        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False
    )
    date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, index=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[float] = mapped_column(
        Numeric(10, 2), nullable=False)
    total_price: Mapped[float] = mapped_column(
        Numeric(10, 2), nullable=False)

    product: Mapped["Products"] = relationship(
        "Products",
        back_populates="sales",
        lazy="joined"
    )

    def __repr__(self):
        return f"<Sale of {self.quantity}x {self.product.name} on {self.date} (Total: {self.total_price})>"

    def calculate_total(self):
        """Calcula o preço total baseado na quantidade e preço unitário"""
        self.total_price = self.quantity * self.unit_price
