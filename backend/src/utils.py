from fastapi import HTTPException, UploadFile
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
                clock_skew_in_ms=100000,  # TODO: resolve clock skew issue on computer and remove
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
        return "user_2"
        # TODO: re-enable error raising after testing
        # raise HTTPException(status_code=500, detail=str(e))


def transform_lake_elmo_data(file: UploadFile) -> list[dict]:
    import pandas as pd
    import camelot

    # Use Camelot to read tables from the PDF file
    tables = camelot.read_pdf(file.file, flavor="stream", pages="1-end")

    # combine all tables into a single DataFrame
    camelot_df = pd.concat([table.df for table in tables], ignore_index=True)

    # convert date columns to datetime
    camelot_df[0] = pd.to_datetime(camelot_df[0], errors="coerce")
    camelot_df.dropna(subset=[0], inplace=True, ignore_index=True)

    # Convert last three columns to numeric
    def currency_to_numeric(series):
        # Remove $ and commas, strip spaces
        cleaned = series.astype(str).str.replace(r"[\$,]", "", regex=True).str.strip()
        # Convert to numeric, invalid parsing becomes NaN
        return pd.to_numeric(cleaned, errors="coerce")

    # Apply conversion
    for col in camelot_df.columns[2:]:
        camelot_df[col] = currency_to_numeric(camelot_df[col]).fillna(0)

    # sum last three columns, convert to cents then drop the ones used to sum
    camelot_df["amount"] = (camelot_df.iloc[:, 2:].sum(axis=1) * 100).astype(int)
    camelot_df.drop(camelot_df.columns[[2, 3, 4]], axis=1, inplace=True)

    # rename columns and return json-like format
    camelot_df.columns = ["date", "description", "amount"]
    return camelot_df.to_dict(orient="records")
