import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

const mockRoadmap = {
  title: "Machine Learning",
  units: [
    { title: "Introduction", lessons: ["What is Machine Learning?", "Types of ML", "ML Applications"] },
    { title: "Core Concepts", lessons: ["Linear Regression", "Logistic Regression", "Decision Trees"] },
    { title: "Advanced Topics", lessons: ["Neural Networks", "Deep Learning", "Reinforcement Learning"] },
  ]
};

const TopicGenerator = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<typeof mockRoadmap | null>(null);

  const generate = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setRoadmap(null);
    setTimeout(() => {
      setRoadmap({ ...mockRoadmap, title: topic });
      setLoading(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-2">Topic Generator</h1>
          <p className="text-muted-foreground text-sm mb-6">Enter a topic and AI will create a structured learning path.</p>

          <div className="flex gap-3">
            <Input
              placeholder="Enter a topic you want to learn..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === "Enter" && generate()}
              className="flex-1"
            />
            <Button onClick={generate} disabled={loading || !topic.trim()} className="gradient-bg border-0 text-primary-foreground">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4 mr-2" /> Generate</>}
            </Button>
          </div>
        </motion.div>

        {loading && (
          <div className="glass-card p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Generating your learning roadmap...</p>
          </div>
        )}

        <AnimatePresence>
          {roadmap && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold">{roadmap.title}</h2>
              {roadmap.units.map((unit, ui) => (
                <motion.div
                  key={unit.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: ui * 0.15 }}
                  className="glass-card p-5"
                >
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <span className="gradient-bg text-primary-foreground text-xs rounded-md px-2 py-0.5">Unit {ui + 1}</span>
                    {unit.title}
                  </h3>
                  <div className="space-y-2">
                    {unit.lessons.map((lesson, li) => (
                      <Link key={lesson} to={`/lesson/${ui * 3 + li + 1}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm">{lesson}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default TopicGenerator;
