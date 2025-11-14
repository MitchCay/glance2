from datetime import datetime, timedelta, date
from typing import Union
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    UploadFile,
)
from sqlalchemy.orm import Session
from .transaction_models import TransactionRequest
from ..database.db import get_user_transactions, add_transaction
from ..utils import authenticate_and_get_user_details
from ..database.models import get_db

router = APIRouter()


@router.get("/get-transactions")
async def get_transactions(
    request: Request,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    db: Session = Depends(get_db),
):
    user_id = "user_1"  # authenticate_and_get_user_details(request)

    if end_date is None:
        end_date = datetime.now()

    if start_date is None:
        start_date = end_date - timedelta(30)

    transactions = get_user_transactions(db, user_id, start_date, end_date)
    return transactions


@router.post("/create-transaction")
def create_transaction(
    request: Request,
    transaction_request: TransactionRequest,
    db: Session = Depends(get_db),
):
    print(request)
    try:
        user_id = "user_2"  # authenticate_and_get_user_details(request)

        # new_transaction = add_transaction(
        #     db=db,
        #     amount=transaction_request.amount,
        #     date=transaction_request.date,
        #     user_id=user_id,
        #     description=transaction_request.description,
        # )

        # return new_transaction

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/uploadfile")
async def file_upload(file: UploadFile):
    try:
        import pandas as pd

        df = pd.read_csv(file.file)
        print(df)

        return df.head().to_dict()

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/test-route")
def test_route(
    request: Request,
    start_date: datetime | None = None,
    end_date: Union[datetime, None] = None,
):
    user_id = authenticate_and_get_user_details(request)

    if start_date is None:
        start_date = datetime.now()

    if end_date is None:
        end_date = start_date - timedelta(30)

    print(end_date)

    return {"start_date": start_date, "end_date": end_date}
