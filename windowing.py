from datetime import datetime, timedelta
from collections import defaultdict


# ============================================================
# STREAM FORGE - MEMBER 3
# 5-MINUTE WINDOWING + LATE-ARRIVING DATA TEST
# ============================================================


WINDOW_SIZE = timedelta(minutes=5)


def parse_timestamp(timestamp):
    """Convert timestamp string into datetime object."""
    return datetime.fromisoformat(timestamp)


def get_window_start(event_time):
    """
    Find the beginning of the 5-minute window
    based on the EVENT timestamp.
    """

    minute = (event_time.minute // 5) * 5

    return event_time.replace(
        minute=minute,
        second=0,
        microsecond=0
    )


def process_window(events):
    """
    Group events into 5-minute windows and calculate
    average temperature for each truck.

    The event timestamp is used to determine
    the correct window.
    """

    windows = defaultdict(list)

    # --------------------------------------------------------
    # Step 1: Process every event
    # --------------------------------------------------------

    for event in events:

        truck_id = event["truck_id"]
        temperature = event["temperature"]
        event_time = parse_timestamp(event["timestamp"])

        # Filter invalid temperatures
        if temperature <= 0:
            continue

        # Find 5-minute window
        window_start = get_window_start(event_time)

        window_end = window_start + WINDOW_SIZE

        # Store event inside its window
        key = (
            truck_id,
            window_start
        )

        windows[key].append({
            "temperature": temperature,
            "timestamp": event_time
        })

    # --------------------------------------------------------
    # Step 2: Calculate average
    # --------------------------------------------------------

    results = []

    for (truck_id, window_start), window_events in sorted(
        windows.items()
    ):

        temperatures = [
            event["temperature"]
            for event in window_events
        ]

        average_temperature = (
            sum(temperatures) / len(temperatures)
        )

        window_end = window_start + WINDOW_SIZE

        results.append({
            "truck_id": truck_id,
            "window_start": window_start,
            "window_end": window_end,
            "average_temperature": average_temperature,
            "event_count": len(window_events)
        })

    return results


# ============================================================
# TEST DATA
# ============================================================

test_events = [

    # --------------------------------------------------------
    # TRUCK-001
    # 10:00 - 10:05 window
    # --------------------------------------------------------

    {
        "truck_id": "TRUCK-001",
        "temperature": 25,
        "timestamp": "2026-08-20T10:00:30"
    },

    {
        "truck_id": "TRUCK-001",
        "temperature": 26,
        "timestamp": "2026-08-20T10:02:00"
    },

    {
        "truck_id": "TRUCK-001",
        "temperature": 27,
        "timestamp": "2026-08-20T10:04:00"
    },


    # --------------------------------------------------------
    # TRUCK-001
    # 10:05 - 10:10 window
    # --------------------------------------------------------

    {
        "truck_id": "TRUCK-001",
        "temperature": 30,
        "timestamp": "2026-08-20T10:07:00"
    },


    # --------------------------------------------------------
    # TRUCK-002
    # 10:00 - 10:05 window
    # --------------------------------------------------------

    {
        "truck_id": "TRUCK-002",
        "temperature": 31,
        "timestamp": "2026-08-20T10:01:00"
    },

    {
        "truck_id": "TRUCK-002",
        "temperature": 33,
        "timestamp": "2026-08-20T10:03:00"
    },


    # --------------------------------------------------------
    # LATE-ARRIVING EVENT
    #
    # This event is added LAST in the input list,
    # but its timestamp is 10:03:30.
    #
    # Therefore it belongs to the earlier
    # 10:00 - 10:05 window.
    # --------------------------------------------------------

    {
        "truck_id": "TRUCK-001",
        "temperature": 28,
        "timestamp": "2026-08-20T10:03:30"
    }
]


# ============================================================
# MAIN PROGRAM
# ============================================================

if __name__ == "__main__":

    print()
    print("=" * 45)
    print("     STREAM FORGE - WINDOWING")
    print("=" * 45)
    print()

    results = process_window(test_events)

    # --------------------------------------------------------
    # Display results
    # --------------------------------------------------------

    for result in results:

        print(f"Truck ID            : {result['truck_id']}")

        print(
            f"Window Start        : "
            f"{result['window_start'].isoformat()}"
        )

        print(
            f"Window End          : "
            f"{result['window_end'].isoformat()}"
        )

        print(
            f"Average Temperature : "
            f"{result['average_temperature']:.2f} °C"
        )

        print(
            f"Event Count         : "
            f"{result['event_count']}"
        )

        print("-" * 40)

    print()
    print("Windowing test completed.")
    print()


    # ========================================================
    # LATE-ARRIVING DATA VERIFICATION
    # ========================================================

    print("=" * 45)
    print("     LATE-ARRIVING DATA TEST")
    print("=" * 45)
    print()

    late_event = {
        "truck_id": "TRUCK-001",
        "temperature": 28,
        "timestamp": "2026-08-20T10:03:30"
    }

    late_time = parse_timestamp(late_event["timestamp"])

    late_window_start = get_window_start(late_time)

    late_window_end = late_window_start + WINDOW_SIZE

    print("Late Event:")
    print(f"Truck ID     : {late_event['truck_id']}")
    print(f"Temperature  : {late_event['temperature']} °C")
    print(f"Event Time   : {late_event['timestamp']}")
    print()

    print("Late event belongs to:")
    print(
        f"{late_window_start.isoformat()} "
        f"→ "
        f"{late_window_end.isoformat()}"
    )

    print()

    print("Late-arriving data handled using event timestamp.")
    print("Test completed successfully.")

    print()
    print("=" * 45)