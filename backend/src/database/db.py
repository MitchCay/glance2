from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from . import models


def get_user_transactions(
        db: Session, 
        user_id: str, 
        start_date: datetime = datetime.now() - timedelta(30),
        end_date: datetime = datetime.now()
):
    return (
        db.query(models.Transactions)
        .filter(models.Transactions.user_id == user_id)
        .filter(models.Transactions.date >= start_date)
        .filter(models.Transactions.date <= end_date)
        .all()
    )


def add_transaction(
    db: Session, amount: float, date: datetime, user_id: str, description: str | None
):
    db_transaction = models.Transactions(
        amount=amount, date=date, user_id=user_id, description=description
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction
