import { } from "react";
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
import { useTheme } from "next-themes";

const initialNodes: Node[] = [
  { id: "1", position: { x: 400, y: 0 }, data: { label: "Machine Learning" }, className: "bg-primary text-primary-foreground border-none rounded-xl px-5 py-3 font-semibold text-sm w-auto shadow-md" },
  { id: "2", position: { x: 150, y: 120 }, data: { label: "Supervised Learning" }, className: "bg-sidebar-accent border-2 border-primary/40 rounded-xl px-4 py-2 text-[13px] text-foreground font-medium shadow-sm" },
  { id: "3", position: { x: 650, y: 120 }, data: { label: "Unsupervised Learning" }, className: "bg-accent/10 border-2 border-accent/40 rounded-xl px-4 py-2 text-[13px] text-foreground font-medium shadow-sm" },
  { id: "4", position: { x: 50, y: 250 }, data: { label: "Linear Regression" }, className: "bg-card border border-border rounded-lg px-3.5 py-2 text-xs text-foreground shadow-sm" },
  { id: "5", position: { x: 250, y: 250 }, data: { label: "Logistic Regression" }, className: "bg-card border border-border rounded-lg px-3.5 py-2 text-xs text-foreground shadow-sm" },
  { id: "6", position: { x: 550, y: 250 }, data: { label: "Clustering" }, className: "bg-card border border-border rounded-lg px-3.5 py-2 text-xs text-foreground shadow-sm" },
  { id: "7", position: { x: 750, y: 250 }, data: { label: "Dimensionality Reduction" }, className: "bg-card border border-border rounded-lg px-3.5 py-2 text-xs text-foreground shadow-sm" },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", style: { stroke: "hsl(var(--primary))", strokeWidth: 2 } },
  { id: "e1-3", source: "1", target: "3", style: { stroke: "hsl(var(--accent))", strokeWidth: 2 } },
  { id: "e2-4", source: "2", target: "4", style: { stroke: "hsl(var(--primary) / 0.5)" } },
  { id: "e2-5", source: "2", target: "5", style: { stroke: "hsl(var(--primary) / 0.5)" } },
  { id: "e3-6", source: "3", target: "6", style: { stroke: "hsl(var(--accent) / 0.5)" } },
  { id: "e3-7", source: "3", target: "7", style: { stroke: "hsl(var(--accent) / 0.5)" } },
];

const KnowledgeGraph = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { theme, systemTheme } = useTheme();

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-3.5rem)] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          colorMode={resolvedTheme as "light" | "dark" | "system"}
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
