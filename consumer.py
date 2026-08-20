from kafka import KafkaConsumer
from processor import process_event
import json

consumer = KafkaConsumer(
    "truck-temperature",
    bootstrap_servers="192.168.85.55:9092",
    auto_offset_reset="earliest",
    group_id="member1-consumer",
    value_deserializer=lambda m: m.decode("utf-8")
)

print("Consumer started. Waiting for messages...")

for message in consumer:
    try:
        processed = process_event(message.value)

        if processed:
            print("Processed Event:")
            print(processed)
        else:
            print("Event filtered out")

    except Exception as e:
        print("Error processing message:", e)