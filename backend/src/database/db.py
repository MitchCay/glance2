from typing import List
from sqlalchemy.orm import Session
from datetime import datetime
from . import models


def get_user_transactions(
    db: Session, user_id: str, start_date: datetime, end_date: datetime
):
    return (
        db.query(models.Transaction)
        .filter(models.Transaction.user_id == user_id)
        .filter(models.Transaction.date >= start_date)
        .filter(models.Transaction.date <= end_date)
        .all()
    )


def add_transaction(db: Session, db_transaction: models.Transaction):

    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def bulk_add_transactions(db: Session, db_transactions: List[models.Transaction]):
    db.add_all(db_transactions)
    db.commit()
    for tx in db_transactions:
        db.refresh(tx)
    return db_transactions


def deduplicate_transactions(db: Session, user_id: str):
    existing_transactions = (
        db.query(models.Transaction).filter(models.Transaction.user_id == user_id).all()
    )
    existing_set = set(
        (tx.amount, tx.date, tx.description) for tx in existing_transactions
    )

    seen = set()
    for tx in existing_transactions:
        key = (tx.amount, tx.date, tx.description)
        if key in existing_set:
            if key in seen:
                db.delete(tx)
            else:
                seen.add(key)

    db.commit()
