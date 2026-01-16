from datetime import datetime, timedelta, date
from typing import List, Union
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    UploadFile,
)
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .transaction_models import TransactionRequest
from ..database.db import (
    bulk_add_transactions,
    deduplicate_transactions,
    get_user_transactions,
    add_transaction,
)
from ..utils import authenticate_and_get_user_details, transform_lake_elmo_data
from ..database.models import Transaction, get_db

router = APIRouter()


@router.get("/get-transactions")
async def get_transactions(
    request: Request,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    db: Session = Depends(get_db),
):
    user_id = authenticate_and_get_user_details(request)

    if end_date is None:
        end_date = datetime.now()

    if start_date is None:
        start_date = end_date - timedelta(30)

    # Deduplicate transactions before fetching: Not sure this is the best place for it
    deduplicate_transactions(db, user_id)

    transactions = get_user_transactions(db, user_id, start_date, end_date)
    results = []
    for tx in transactions:
        results.append(
            {
                "id": tx.id,
                "amount": tx.amount / 100.0,
                "date": tx.date,
                "userId": tx.user_id,
                "description": tx.description,
            }
        )

    return results


@router.post("/create-transaction")
def create_transaction(
    request: Request,
    transaction_request: TransactionRequest,
    db: Session = Depends(get_db),
):
    print(request.headers)
    try:

        db_transaction = Transaction(
            amount=transaction_request.amountCents,
            date=transaction_request.date,
            user_id=authenticate_and_get_user_details(request),
            description=transaction_request.description,
        )

        new_transaction = add_transaction(
            db=db,
            db_transaction=db_transaction,
        )

        return new_transaction

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/uploadfile")
async def upload_file(file: UploadFile):
    try:
        import pandas as pd

        df = pd.read_csv(file.file)
        print(df)

        return df.head().to_dict()

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/bulk-transaction-add")
async def bulk_transaction_add(
    request: Request,
    file: UploadFile,
    db: Session = Depends(get_db),
):
    try:
        transactions = transform_lake_elmo_data(file)
        db_transactions = [
            Transaction(user_id=authenticate_and_get_user_details(request), **tx)
            for tx in transactions
        ]

        trans = bulk_add_transactions(db, db_transactions)

        return trans
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


"""
Test route
"""


class TestClass(BaseModel):
    amountCents: int
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


@router.post("/test-route")
async def test_route(request: Request, test_request: TestClass):

    data = request.headers
    print(data)
    print("\n")
    print(test_request)

    return {"Content": test_request, "Success": "yeah boi"}
