from pydantic import BaseModel
from datetime import datetime


class TransactionRequest(BaseModel):
    amountCents: int
    date: datetime
    description: str | None = None

    class Config:
        json_schema_extra = {
            "example": {
                "amountCents": 12345,
                "date": "2025-11-12 00:00:00",
                "description": "optional",
            }
        }
