import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import DashboardLayout from "@/components/DashboardLayout";

const initialNodes: Node[] = [
  { id: "1", position: { x: 400, y: 0 }, data: { label: "Machine Learning" }, style: { background: "hsl(250 80% 60%)", color: "white", border: "none", borderRadius: 12, padding: "12px 20px", fontWeight: 600, fontSize: 14 } },
  { id: "2", position: { x: 150, y: 120 }, data: { label: "Supervised Learning" }, style: { background: "hsl(250 80% 96%)", border: "2px solid hsl(250 80% 80%)", borderRadius: 12, padding: "10px 16px", fontSize: 13 } },
  { id: "3", position: { x: 650, y: 120 }, data: { label: "Unsupervised Learning" }, style: { background: "hsl(168 70% 95%)", border: "2px solid hsl(168 70% 70%)", borderRadius: 12, padding: "10px 16px", fontSize: 13 } },
  { id: "4", position: { x: 50, y: 250 }, data: { label: "Linear Regression" }, style: { background: "white", border: "1px solid hsl(220 13% 90%)", borderRadius: 10, padding: "8px 14px", fontSize: 12 } },
  { id: "5", position: { x: 250, y: 250 }, data: { label: "Logistic Regression" }, style: { background: "white", border: "1px solid hsl(220 13% 90%)", borderRadius: 10, padding: "8px 14px", fontSize: 12 } },
  { id: "6", position: { x: 550, y: 250 }, data: { label: "Clustering" }, style: { background: "white", border: "1px solid hsl(220 13% 90%)", borderRadius: 10, padding: "8px 14px", fontSize: 12 } },
  { id: "7", position: { x: 750, y: 250 }, data: { label: "Dimensionality Reduction" }, style: { background: "white", border: "1px solid hsl(220 13% 90%)", borderRadius: 10, padding: "8px 14px", fontSize: 12 } },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", style: { stroke: "hsl(250 80% 70%)", strokeWidth: 2 } },
  { id: "e1-3", source: "1", target: "3", style: { stroke: "hsl(168 70% 60%)", strokeWidth: 2 } },
  { id: "e2-4", source: "2", target: "4", style: { stroke: "hsl(250 80% 80%)" } },
  { id: "e2-5", source: "2", target: "5", style: { stroke: "hsl(250 80% 80%)" } },
  { id: "e3-6", source: "3", target: "6", style: { stroke: "hsl(168 70% 70%)" } },
  { id: "e3-7", source: "3", target: "7", style: { stroke: "hsl(168 70% 70%)" } },
];

const KnowledgeGraph = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-3.5rem)] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          className="bg-background"
        >
          <Background color="hsl(var(--border))" gap={20} />
          <Controls className="bg-card border-border" />
          <MiniMap
            style={{ background: "hsl(var(--card))" }}
            nodeColor="hsl(var(--primary))"
          />
        </ReactFlow>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeGraph;
