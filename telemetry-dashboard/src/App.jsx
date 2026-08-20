import { useEffect, useState } from "react";
import { useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "@xyflow/react/dist/style.css";

const telemetryData = [
  { time: "10:00", temperature: 68, speed: 55 },
  { time: "10:05", temperature: 70, speed: 60 },
  { time: "10:10", temperature: 72, speed: 65 },
  { time: "10:15", temperature: 74, speed: 70 },
  { time: "10:20", temperature: 71, speed: 63 },
  { time: "10:25", temperature: 73, speed: 68 },
];

const initialNodes = [
  {
    id: "truck",
    position: { x: 50, y: 200 },
    data: { label: "🚚 Truck Telemetry" },
  },
  {
    id: "producer",
    position: { x: 300, y: 200 },
    data: { label: "📤 Python Producer" },
  },
  {
    id: "kafka",
    position: { x: 550, y: 200 },
    data: { label: "📦 Kafka Topic" },
  },
  {
    id: "processor",
    position: { x: 800, y: 200 },
    data: { label: "⚙️ Stream Processor" },
  },
  {
    id: "worker1",
    position: { x: 1100, y: 80 },
    data: { label: "👷 Worker 1" },
  },
  {
    id: "worker2",
    position: { x: 1100, y: 200 },
    data: { label: "👷 Worker 2" },
  },
  {
    id: "worker3",
    position: { x: 1100, y: 320 },
    data: { label: "👷 Worker 3" },
  },
];

const initialEdges = [
  { id: "e1", source: "truck", target: "producer", animated: true },
  { id: "e2", source: "producer", target: "kafka", animated: true },
  { id: "e3", source: "kafka", target: "processor", animated: true },
  { id: "e4", source: "processor", target: "worker1", animated: true },
  { id: "e5", source: "processor", target: "worker2", animated: true },
  { id: "e6", source: "processor", target: "worker3", animated: true },
];

function App() {
  const [metrics, setMetrics] = useState({
  truck_id: "TRUCK-001",
  speed: 65,
  temperature: 72,
  engine_status: "Running",
});

useEffect(() => {
  const fetchMetrics = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/metrics");
      const data = await response.json();

      setMetrics(data);
    } catch (error) {
      console.error("API connection error:", error);
    }
  };

  fetchMetrics();

  const interval = setInterval(fetchMetrics, 2000);

  return () => clearInterval(interval);
}, []);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="header">
        <h1>TELEMETRY STREAMING DASHBOARD</h1>
        <p>Real-Time IoT Truck Monitoring</p>
      </div>

      {/* TELEMETRY CARDS */}
      <div className="cards">

        <div className="metric-card">
          <span>🚚 Truck ID</span>
          <strong>TRUCK-001</strong>
        </div>

        <div className="metric-card">
          <span>🏎️ Speed</span>
          <strong>65 km/h</strong>
        </div>

        <div className="metric-card">
          <span>🌡️ Temperature</span>
          <strong>72 °C</strong>
        </div>

        <div className="metric-card">
          <span>🟢 Engine Status</span>
          <strong>Running</strong>
        </div>

      </div>

      {/* GRAPHS */}
      <div className="charts">

        {/* TEMPERATURE GRAPH */}
        <div className="chart-card">
          <h2>🌡️ Temperature Monitoring</h2>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={telemetryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#ef4444"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SPEED GRAPH */}
        <div className="chart-card">
          <h2>🏎️ Speed Monitoring</h2>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={telemetryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="speed"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
            {/* WORKER STATUS */}
      <div className="worker-section">
        <h2>👷 Worker Status</h2>

        <div className="workers">

          <div className="worker-card">
            <div className="worker-title">
              <span className="status-dot"></span>
              Worker 1
            </div>
            <strong>Active</strong>
            <p>Processing telemetry data</p>
          </div>

          <div className="worker-card">
            <div className="worker-title">
              <span className="status-dot"></span>
              Worker 2
            </div>
            <strong>Active</strong>
            <p>Processing telemetry data</p>
          </div>

          <div className="worker-card">
            <div className="worker-title">
              <span className="status-dot"></span>
              Worker 3
            </div>
            <strong>Active</strong>
            <p>Processing telemetry data</p>
          </div>

        </div>
      </div>

      {/* REACT FLOW TOPOLOGY */}
      <div className="topology">
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