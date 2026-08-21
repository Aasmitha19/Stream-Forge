from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json


app = FastAPI(title="Telemetry Dashboard API")


# Allow React dashboard to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Telemetry Dashboard API is running"
    }


@app.get("/metrics")
def get_metrics():

    try:
        with open("member3_output.json", "r") as file:
            data = json.load(file)

        return {
            "status": "success",
            "count": len(data),
            "metrics": data
        }

    except FileNotFoundError:

        return {
            "status": "error",
            "message": "member3_output.json not found"
        }