from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database.database import engine, Base
from .routers import categories, products, sales

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["categories"])
app.include_router(sales.router, prefix="/api/v1/sales", tags=["sales"])

@app.get("/")
def root():
    return {"message": "SmartMart API is running"}