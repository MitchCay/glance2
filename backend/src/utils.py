from fastapi import HTTPException
from clerk_backend_api import Clerk, AuthenticateRequestOptions
import os
from dotenv import load_dotenv

load_dotenv()

clerk_sdk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))


def authenticate_and_get_user_details(request) -> str:
    try:
        request_state = clerk_sdk.authenticate_request(
            request,
            AuthenticateRequestOptions(
                authorized_parties=["http://localhost:5173", "http://localhost:5174"],
                jwt_key=os.getenv("JWT_KEY"),
            ),
        )
        if not request_state.is_signed_in:
            raise HTTPException(status_code=401, detail="Invalid Token")

        if request_state.payload != None:
            user_id: str = request_state.payload["sub"]
        else:
            raise HTTPException(
                status_code=401, detail="request state contains empty payload"
            )

        return user_id

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
