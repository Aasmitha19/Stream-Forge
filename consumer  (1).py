import json
from kafka import KafkaConsumer
from processor import process_event


consumer = KafkaConsumer(
    "truck-temperature",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="earliest",
    enable_auto_commit=True,
    group_id="telemetry-group",
    value_deserializer=lambda m: m.decode("utf-8")
)

print("=" * 50)
print("       STREAM FORGE - KAFKA CONSUMER")
print("=" * 50)
print("Connected to Kafka")
print("Topic: truck-temperature")
print("Waiting for telemetry messages...")
print()


for message in consumer:

    try:
        raw_data = message.value

        print("Received Kafka Event:")
        print(raw_data)

        processed_data = process_event(raw_data)

        if processed_data:
            print("Processed Event:")
            print(processed_data)
        else:
            print("Event filtered out")

        print("-" * 50)

    except Exception as e:
        print("Error processing message:", e)