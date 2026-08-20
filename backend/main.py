from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

latest_metrics = {
    "truck_id": "TRUCK-001",
    "speed": 65,
    "temperature": 72,
    "engine_status": "Running",
}


@app.get("/")
def home():
    return {
        "message": "Telemetry Backend is running"
    }


@app.get("/metrics")
def get_metrics():
    return latest_metrics