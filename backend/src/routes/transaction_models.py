from pydantic import BaseModel
from datetime import datetime


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
