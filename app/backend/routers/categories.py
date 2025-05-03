
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List

from ..service.categories import (
    create_category,
    get_categories,
    update_category,
    delete_category,
    process_categories_csv
)

from ..database.database import get_db

from ..schemas.schemas import (
    CategoryCreate,
    Category,
    CategoryUpdate,
)

from ..schemas.schemas import CSVUploadResponse

router = APIRouter()


@router.post("/", response_model=Category)
def create_category_endpoint(
    category: CategoryCreate,
    db: Session = Depends(get_db)
):
    return create_category(db=db, category=category)


@router.post("/upload-csv/", response_model=CSVUploadResponse)
async def upload_categories_csv(
    file: UploadFile = File(),
    db: Session = Depends(get_db)
):
    if not file.filename or not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="Apenas arquivos CSV são permitidos"
        )

    try:
        contents = await file.read()
        decoded = contents.decode('utf-8')
    except UnicodeDecodeError:
        try:
            decoded = contents.decode('latin1')
        except Exception as decode_error:
            raise HTTPException(
                status_code=400,
                detail=f"Erro ao decodificar o arquivo: {str(decode_error)}"
            )
    except Exception as read_error:
        raise HTTPException(
            status_code=400,
            detail=f"Erro ao ler o arquivo: {str(read_error)}"
        )

    try:
        records_processed = process_categories_csv(db, decoded)
        return {
            "message": "CSV processado com sucesso",
            "records_processed": records_processed
        }
    except HTTPException:
        raise
    except Exception as process_error:
        raise HTTPException(
            status_code=400,
            detail=f"Erro ao processar CSV: {str(process_error)}"
        )


@router.get("/", response_model=List[Category])
def read_categories(db: Session = Depends(get_db)):
    return get_categories(db=db)


@router.patch("/{category_id}", response_model=Category)
def update_category_endpoint(
    category_id: int,
    category_update: CategoryUpdate,
    db: Session = Depends(get_db)
):
    try:
        return update_category(db, category_id, category_update)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error updating category: {str(e)}"
        )


@router.delete("/{category_id}", response_model=Category)
def delete_category_endpoint(
    category_id: int,
    db: Session = Depends(get_db)
):
    try:
        return delete_category(db=db, category_id=category_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error deleting category: {str(e)}"
        )
