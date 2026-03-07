import { motion } from "framer-motion";
import { BookOpen, Flame, Trophy, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { label: "Topics Learning", value: "8", icon: BookOpen, color: "bg-primary/10 text-primary" },
  { label: "Lessons Completed", value: "42", icon: TrendingUp, color: "bg-success/10 text-success" },
  { label: "Study Streak", value: "12 days", icon: Flame, color: "bg-warning/10 text-warning" },
  { label: "Avg Quiz Score", value: "87%", icon: Trophy, color: "bg-accent/10 text-accent" },
];

const topics = [
  { title: "Machine Learning", progress: 65 },
  { title: "Artificial Intelligence", progress: 40 },
  { title: "Python Programming", progress: 80 },
];

const weeklyData = [
  { day: "Mon", lessons: 4 }, { day: "Tue", lessons: 6 }, { day: "Wed", lessons: 3 },
  { day: "Thu", lessons: 7 }, { day: "Fri", lessons: 5 }, { day: "Sat", lessons: 8 },
  { day: "Sun", lessons: 2 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } })
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} initial="hidden" animate="visible"
              className="glass-card p-5"
            >
              <div className={`rounded-lg p-2 w-fit mb-3 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Continue Learning */}
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible">
          <h3 className="font-semibold mb-4">Continue Learning</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {topics.map((t) => (
              <div key={t.title} className="glass-card p-5 hover-lift">
                <h4 className="font-medium mb-3">{t.title}</h4>
                <Progress value={t.progress} className="h-2 mb-3" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{t.progress}% complete</span>
                  <Link to="/lesson/1">
                    <Button size="sm" variant="ghost" className="text-xs">
                      Continue <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible"
          className="glass-card p-6"
        >
          <h3 className="font-semibold mb-4">Weekly Learning Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="lessons" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
