import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Sparkles, BookOpen, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link, useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import ReactMarkdown from "react-markdown";
import { api, Lesson } from "@/lib/api";
import { toast } from "sonner";

const LessonReader = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;
      setLoading(true);
      try {
        const data = await api.getLesson(parseInt(lessonId));
        setLesson(data);
        // Check if already completed (this needs a separate check or part of getLesson)
        // For now we assume false until marked
      } catch (err) {
        toast.error("Failed to load lesson content");
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleToggleComplete = async () => {
    if (!lessonId) return;
    setMarking(true);
    const newState = !completed;
    try {
      await api.markComplete(parseInt(lessonId), newState);
      setCompleted(newState);
      toast.success(newState ? "Lesson marked as complete! 🏆" : "Progress updated.");
    } catch (err) {
      toast.error("Failed to update progress");
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium italic">Engineering your lesson content...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!lesson) {
    return (
      <DashboardLayout>
        <div className="p-12 text-center">
            <h2 className="text-xl font-bold mb-4">Lesson not found</h2>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-background/50 backdrop-blur-sm">
          {/* Reading Progress */}
          <div className="sticky top-0 z-20">
            <Progress value={completed ? 100 : 30} className="h-1 rounded-none bg-primary/10" />
          </div>

          <div className="p-8 max-w-4xl mx-auto">
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-9 border-primary/10 hover:bg-primary/5"
                        onClick={() => navigate(`/tutor?topicId=${lesson.topic_id}&lessonId=${lesson.id || lessonId}&topicName=${encodeURIComponent("Current Topic")}&lessonTitle=${encodeURIComponent(lesson.title)}`)}
                    >
                        <MessageSquare className="h-4 w-4 mr-2 text-primary" /> Ask AI Tutor
                    </Button>
                    <Link to="/quiz">
                        <Button size="sm" variant="outline" className="h-9 border-accent/10 hover:bg-accent/5">
                            <BookOpen className="h-4 w-4 mr-2 text-accent" /> Take Quiz
                        </Button>
                    </Link>
                    <Button
                        size="sm"
                        onClick={handleToggleComplete}
                        disabled={marking}
                        className={`h-9 font-bold transition-all ${
                            completed 
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20" 
                            : "gradient-bg text-white border-0 shadow-lg shadow-purple-500/20"
                        }`}
                        variant={completed ? "outline" : "default"}
                    >
                        {marking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                        {completed ? "Completed" : "Mark Complete"}
                    </Button>
                </div>
            </div>

            {/* Lesson Container */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-10 rounded-3xl border border-border/50 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                
                <h1 className="text-4xl font-extrabold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    {lesson.title}
                </h1>

                {/* Markdown Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-strong:text-foreground prose-strong:font-bold
                    prose-code:bg-muted/50 prose-code:text-primary prose-code:px-2 prose-code:py-0.5 prose-code:rounded-lg prose-code:text-[0.9em] prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border/50 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:shadow-xl
                    prose-li:text-muted-foreground
                    prose-img:rounded-2xl prose-img:shadow-2xl
                    prose-hr:border-border/50
                ">
                    <ReactMarkdown>{lesson.content}</ReactMarkdown>
                </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LessonReader;
