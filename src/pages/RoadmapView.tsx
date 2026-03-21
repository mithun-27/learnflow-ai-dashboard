import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "next-themes";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Save, Loader2, Sparkles, Trash2, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const RoadmapView = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [topicName, setTopicName] = useState("");
  const { theme, systemTheme } = useTheme();

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  const fetchRoadmap = useCallback(async () => {
    if (!topicId) return;
    setLoading(true);
    try {
      const data = await api.getRoadmap(parseInt(topicId));
      setTopicName(data.topic);
      if (data.roadmap_graph) {
        setNodes(data.roadmap_graph.nodes || []);
        setEdges(data.roadmap_graph.edges || []);
      } else {
        // Fallback or Initial implementation
        toast.info("No visual graph found. Re-generating default view...");
      }
    } catch (err) {
      toast.error("Failed to load roadmap graph");
    } finally {
      setLoading(false);
    }
  }, [topicId, setNodes, setEdges]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, style: { stroke: "hsl(var(--primary))", strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const [confirming, setConfirming] = useState(false);

  const confirmRoadmap = async () => {
    if (!topicId) return;
    setConfirming(true);
    try {
      const res = await api.confirmRoadmap(parseInt(topicId), nodes, edges);
      toast.success(res.message);
      // Optionally redirect to dashboard or show completion state
    } catch (err) {
      toast.error("Failed to confirm roadmap");
    } finally {
      setConfirming(false);
    }
  };

  const saveGraph = async () => {
    if (!topicId) return;
    setSaving(true);
    try {
      await api.updateRoadmapGraph(parseInt(topicId), nodes, edges);
      toast.success("Roadmap layout saved!");
    } catch (err) {
      toast.error("Failed to save layout");
    } finally {
      setSaving(false);
    }
  };

  const addNode = () => {
    const newNode: Node = {
      id: `custom_${Date.now()}`,
      position: { x: 100, y: 100 },
      data: { label: "New Learning Step" },
      className: "bg-card border border-border rounded-lg px-3.5 py-2 text-xs text-foreground shadow-sm",
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onNodeClick = (_: any, node: Node) => {
    // Determine if it's a lesson node
    if (node.id.startsWith("lesson_") || node.id.startsWith("custom_")) {
      toast.custom((t) => (
        <div className="bg-card border border-border p-4 rounded-xl shadow-2xl flex flex-col gap-3 min-w-[250px]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold truncate">{node.data.label as string}</span>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium">Engineer this lesson or remove it from your roadmap?</p>
          <div className="flex gap-2 mt-1">
            <Button size="sm" className="flex-1 gradient-bg text-xs h-8 text-white font-bold" onClick={() => {
                 toast.dismiss(t);
                 navigate(`/lesson/${node.id.split('_')[1] || 0}`);
            }}>
              <ArrowRight className="h-3 w-3 mr-1" /> Start
            </Button>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-destructive/20 hover:bg-destructive/10 text-destructive" onClick={() => {
                setNodes(nds => nds.filter(n => n.id !== node.id));
                setEdges(eds => eds.filter(e => e.source !== node.id && e.target !== node.id));
                toast.dismiss(t);
            }}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ));
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Architecting Your Roadmap...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full overflow-hidden">
        <header className="px-6 py-3 border-b border-border bg-background/50 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold truncate max-w-[300px]">{topicName}</h1>
            <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded shadow-sm">Learning Path</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/tutor?topicId=${topicId}&topicName=${encodeURIComponent(topicName)}`)} className="h-8 text-xs font-bold border-primary/20 hover:bg-primary/5">
              <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-primary" /> Ask Tutor
            </Button>
            <Button variant="outline" size="sm" onClick={addNode} className="h-8 text-xs font-bold border-primary/20 hover:bg-primary/5">
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Step
            </Button>
            <Button onClick={saveGraph} disabled={saving} size="sm" className="h-8 text-xs font-bold border-primary/20 hover:bg-primary/5" variant="outline">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
              Save Layout
            </Button>
            <Button onClick={confirmRoadmap} disabled={confirming} size="sm" className="h-8 text-xs gradient-bg border-0 text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-purple-500/20">
              {confirming ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Sparkles className="h-3.5 w-3.5 mr-1.5" />}
              Confirm & Generate Lessons
            </Button>
          </div>
        </header>

        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            colorMode={resolvedTheme as "light" | "dark" | "system"}
            className="bg-background select-none"
          >
            <Background color="hsl(var(--border))" gap={20} />
            <Controls className="bg-card border-border fill-foreground" />
            <MiniMap
              style={{ background: "hsl(var(--card))" }}
              nodeColor={(n: any) => {
                if (n.id === "root") return "hsl(var(--primary))";
                if (n.id.startsWith("unit_")) return "hsl(var(--sidebar-accent))";
                return "hsl(var(--muted))";
              }}
            />
          </ReactFlow>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoadmapView;
