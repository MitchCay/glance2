from sqlalchemy import Column, Integer, String, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

conn_string = os.environ.get("DB_CONN_STRING")

if not conn_string:
    raise ValueError("Empty Database URL")

engine = create_engine(
    conn_string,
    echo=True,
)
Base = declarative_base()


class Transactions(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    amount = Column(Integer, nullable=False)
    date = Column(DateTime, nullable=False)
    user_id = Column(String, nullable=False)
    description = Column(String, nullable=True)


Base.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
