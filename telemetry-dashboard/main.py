from fastapi import FastAPI
from kafka import KafkaConsumer
import json

app = FastAPI(title="Telemetry Dashboard Backend")

# Kafka Consumer
consumer = KafkaConsumer(
    "telemetry-data",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="latest",
    enable_auto_commit=True,
    group_id="telemetry-dashboard",
    value_deserializer=lambda x: json.loads(x.decode("utf-8"))
)


@app.get("/")
def home():
    return {
        "message": "Telemetry Dashboard Backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "OK"
    }


@app.get("/telemetry")
def get_telemetry():

    records = consumer.poll(timeout_ms=1000)

    latest_data = {}

    for topic_partition, messages in records.items():
        for message in messages:
            latest_data = message.value

    return latest_data