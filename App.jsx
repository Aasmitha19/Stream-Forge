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
  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
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
  );
}

export default App;