import { useCallback, useEffect, useState } from "react";

import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const initialNodes = [
  {
    id: "truck",
    position: { x: 50, y: 250 },
    data: { label: "🚚 Truck Telemetry" },
  },
  {
    id: "producer",
    position: { x: 300, y: 250 },
    data: { label: "📤 Python Producer" },
  },
  {
    id: "kafka",
    position: { x: 550, y: 250 },
    data: { label: "📦 Kafka Topic" },
  },
  {
    id: "processor",
    position: { x: 800, y: 250 },
    data: { label: "⚙️ Stream Processor" },
  },
  {
    id: "worker1",
    position: { x: 1100, y: 100 },
    data: { label: "👷 Worker 1" },
  },
  {
    id: "worker2",
    position: { x: 1100, y: 250 },
    data: { label: "👷 Worker 2" },
  },
  {
    id: "worker3",
    position: { x: 1100, y: 400 },
    data: { label: "👷 Worker 3" },
  },
];

const initialEdges = [
  {
    id: "e1",
    source: "truck",
    target: "producer",
    animated: true,
  },
  {
    id: "e2",
    source: "producer",
    target: "kafka",
    animated: true,
  },
  {
    id: "e3",
    source: "kafka",
    target: "processor",
    animated: true,
  },
  {
    id: "e4",
    source: "processor",
    target: "worker1",
    animated: true,
  },
  {
    id: "e5",
    source: "processor",
    target: "worker2",
    animated: true,
  },
  {
    id: "e6",
    source: "processor",
    target: "worker3",
    animated: true,
  },
];

function App() {
  // ==============================
  // REAL-TIME API METRICS
  // ==============================

  const [metrics, setMetrics] = useState(null);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/metrics"
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();

        setMetrics(data);
        setApiConnected(true);

        console.log("API data:", data);
      } catch (error) {
        console.error("API connection error:", error);
        setApiConnected(false);
      }
    };

    // Get data immediately
    fetchMetrics();

    // Get new data every 2 seconds
    const interval = setInterval(fetchMetrics, 2000);

    // Stop interval when component closes
    return () => clearInterval(interval);
  }, []);

  // ==============================
  // REACT FLOW
  // ==============================

  const [nodes, , onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // ==============================
  // DASHBOARD
  // ==============================

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          marginBottom: "25px",
          borderBottom: "1px solid #334155",
          paddingBottom: "15px",
        }}
      >
        <h1>
          TELEMETRY STREAMING DASHBOARD
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "18px",
          }}
        >
          Real-Time IoT Truck Monitoring
        </p>

        {/* API STATUS */}

        <div
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            color: apiConnected
              ? "#22c55e"
              : "#ef4444",
          }}
        >
          {apiConnected
            ? "🟢 API Connected"
            : "🔴 API Disconnected"}
        </div>
      </div>

      {/* TELEMETRY CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* TRUCK ID */}

        <div className="metric-card">
          <span>🚚 Truck ID</span>

          <strong>
            {metrics?.truck_id ?? "Loading..."}
          </strong>
        </div>

        {/* SPEED */}

        <div className="metric-card">
          <span>🏎️ Speed</span>

          <strong>
            {metrics
              ? `${metrics.speed} km/h`
              : "Loading..."}
          </strong>
        </div>

        {/* TEMPERATURE */}

        <div className="metric-card">
          <span>🌡️ Temperature</span>

          <strong>
            {metrics
              ? `${metrics.temperature} °C`
              : "Loading..."}
          </strong>
        </div>

        {/* ENGINE STATUS */}

        <div className="metric-card">
          <span>🟢 Engine Status</span>

          <strong>
            {metrics?.engine_status ??
              "Loading..."}
          </strong>
        </div>
      </div>

      {/* REAL-TIME INFORMATION */}

      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <h2>📡 Live Telemetry Data</h2>

        {metrics ? (
          <div>
            <p>
              <strong>Truck:</strong>{" "}
              {metrics.truck_id}
            </p>

            <p>
              <strong>Speed:</strong>{" "}
              {metrics.speed} km/h
            </p>

            <p>
              <strong>Temperature:</strong>{" "}
              {metrics.temperature} °C
            </p>

            <p>
              <strong>Engine:</strong>{" "}
              {metrics.engine_status}
            </p>
          </div>
        ) : (
          <p>Waiting for telemetry data...</p>
        )}
      </div>

      {/* REACT FLOW TOPOLOGY */}

      <div
        style={{
          height: "500px",
          background: "#111827",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;