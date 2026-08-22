# Member 1 - Kafka Setup

## Kafka Broker

localhost:9092

## Kafka Topic

truck-temperature

## Partitions

3

## Replication Factor

1

## Message Format

Truck_ID,Temperature,Timestamp

## Example

TRUCK001,32.5,2026-08-19T12:45:00

## Kafka Verification

The Kafka setup was successfully tested using:

Producer → Kafka Topic → Consumer

Messages were successfully produced to the `truck-temperature` topic and consumed from the topic.

## Topic Verification

Topic: truck-temperature

Partition 0: Leader 1
Partition 1: Leader 1
Partition 2: Leader 1

## Member 1 Responsibilities Completed

- Installed and configured Apache Kafka
- Initialized Kafka KRaft storage
- Started Kafka broker
- Created `truck-temperature` topic
- Configured 3 partitions
- Tested Kafka producer
- Tested Kafka consumer
- Verified Producer → Kafka → Consumer communication