from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    UploadFile,
    File,
)
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database.db import get_user_transactions, add_transaction
from ..utils import authenticate_and_get_user_details
from ..database.models import get_db
import csv
from datetime import datetime


router = APIRouter()


class TransactionRequest(BaseModel):
    amount: float
    date: datetime
    description: str | None = None

    class Config:
        json_schema_extra = {
            "example": {
                "amount": 123.45,
                "date": "2025-11-12 00:00:00",
                "description": "optional",
            }
        }


@router.get("/get-transactions")
async def get_transactions(request: Request, db: Session = Depends(get_db)):
    # user_id = authenticate_and_get_user_details(request)
    user_id = "user_1"

    transactions = get_user_transactions(db, user_id)
    return transactions


@router.post("/create-transactions")
async def create_transaction(
    request: Request,
    transaction_request: TransactionRequest,
    db: Session = Depends(get_db),
):
    try:
        # user_id = authenticate_and_get_user_details(request)
        user_id = "user_1"

        new_transaction = add_transaction(
            db=db,
            amount=transaction_request.amount,
            date=transaction_request.date,
            user_id=user_id,
            description=transaction_request.description,
        )

        return new_transaction

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/uploadfile")
async def file_upload(file: UploadFile):
    try:
        import pandas as pd

        df = pd.read_csv(file.file)

        return df.head().to_dict()

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
