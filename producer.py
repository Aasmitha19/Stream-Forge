from kafka import KafkaProducer
import json
import random
import time
from datetime import datetime
truck_ids = ["TRUCK001", "TRUCK002", "TRUCK003"]

while True:
    data = {
        "truck_id": random.choice(truck_ids),
        "temperature": round(random.uniform(20, 40), 2),
        "timestamp": datetime.now().isoformat()
    }

    print("Message:", data)
    time.sleep(2)