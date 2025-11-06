from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import transactions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # lock this down in prod
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(transactions.router, prefix="/transactions")
