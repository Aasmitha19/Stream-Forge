import json


def process_event(message):
    data = json.loads(message)

    # Filter
    if data["temperature"] <= 0:
        return None

    # Map
    processed_data = {
        "truck_id": data["truck_id"],
        "temperature": data["temperature"],
        "timestamp": data["timestamp"],
        "status": "valid"
    }

    return processed_data


# Sample events
messages = [
    json.dumps({
        "truck_id": "TRUCK-001",
        "temperature": 25.0,
        "timestamp": "2026-08-20T10:01:00"
    }),
    json.dumps({
        "truck_id": "TRUCK-001",
        "temperature": 26.0,
        "timestamp": "2026-08-20T10:02:00"
    }),
    json.dumps({
        "truck_id": "TRUCK-001",
        "temperature": 27.0,
        "timestamp": "2026-08-20T10:03:00"
    }),
    json.dumps({
        "truck_id": "TRUCK-001",
        "temperature": 28.0,
        "timestamp": "2026-08-20T10:03:30"
    }),
    json.dumps({
        "truck_id": "TRUCK-001",
        "temperature": 30.0,
        "timestamp": "2026-08-20T10:07:00"
    }),
    json.dumps({
        "truck_id": "TRUCK-002",
        "temperature": 31.0,
        "timestamp": "2026-08-20T10:01:00"
    }),
    json.dumps({
        "truck_id": "TRUCK-002",
        "temperature": 33.0,
        "timestamp": "2026-08-20T10:02:00"
    })
]


processed_events = []

for message in messages:
    result = process_event(message)

    if result:
        processed_events.append(result)


# Save Member 2 output
with open("member2_output.json", "w") as file:
    json.dump(processed_events, file, indent=4)


print("==========================================")
print("       MEMBER 2 PROCESSING COMPLETE")
print("==========================================")

print("Processed Events:", len(processed_events))
print("Output saved to: member2_output.json")