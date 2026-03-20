import { motion } from "framer-motion";
import { BookOpen, Flame, Trophy, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { subDays, format } from "date-fns";

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

const generateCalendarData = () => {
  const data = [];
  const today = new Date();
  for (let i = 365; i >= 0; i--) {
    const date = subDays(today, i);
    const count = Math.floor(Math.random() * 5); // 0 to 4
    let level = 0;
    if (count === 1) level = 1;
    if (count === 2) level = 2;
    if (count === 3) level = 3;
    if (count >= 4) level = 4;
    data.push({
      date: format(date, "yyyy-MM-dd"),
      count,
      level: level as 0 | 1 | 2 | 3 | 4,
    });
  }
  return data;
};

const activityData = generateCalendarData();

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } })
};

import { useEffect, useState } from "react";
import { api, Topic } from "@/lib/api";

const Dashboard = () => {
  const { theme, systemTheme } = useTheme();
  const [userTopics, setUserTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.getTopics();
        setUserTopics(res);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchDashboardData();
  }, []);

  // Determine actual theme used for ActivityCalendar
  const resolvedTheme = theme === 'system' ? systemTheme : theme;
  const isDark = resolvedTheme === 'dark';

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
              <p className="text-2xl font-bold">{s.label === "Topics Learning" ? userTopics.length : s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Continue Learning */}
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible">
          <h3 className="font-semibold mb-4">Continue Learning</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {userTopics.length > 0 ? (
              userTopics.map((t) => (
                <div key={t.id} className="glass-card p-5 hover-lift">
                  <h4 className="font-medium mb-3">{t.title}</h4>
                  <Progress value={100} className="h-2 mb-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Generated</span>
                    <Link to="/topics">
                      <Button size="sm" variant="ghost" className="text-xs">
                        View Roadmap <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-3 glass-card p-8 text-center border-dashed border-2">
                <p className="text-muted-foreground mb-4">You haven't generated any topics yet.</p>
                <Link to="/topics">
                  <Button className="gradient-bg border-0 text-white">Generate Your First Topic</Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible"
          className="glass-card p-6 overflow-hidden"
        >
          <h3 className="font-semibold mb-6">Learning Contributions</h3>
          <div className="flex justify-center w-full overflow-x-auto pb-4">
            <div className="min-w-fit">
              <ActivityCalendar
                data={activityData}
                maxLevel={4}
                blockSize={14}
                blockRadius={2}
                blockMargin={4}
                colorScheme={isDark ? "dark" : "light"}
                theme={{
                  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                }}
                labels={{
                  legend: {
                    less: "Less",
                    more: "More"
                  },
                  months: [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                  ],
                  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                  totalCount: '{{count}} lessons in the last year'
                }}
                renderBlock={(block, activity) => (
                  <div title={`${activity.count} lessons on ${activity.date}`}>
                    {block}
                  </div>
                )}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
