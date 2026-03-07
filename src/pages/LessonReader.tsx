import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Sparkles, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import ReactMarkdown from "react-markdown";

const lessonContent = `
## What is Machine Learning?

Machine Learning (ML) is a subset of artificial intelligence that enables systems to **learn and improve** from experience without being explicitly programmed.

### Key Concepts

- **Supervised Learning**: The algorithm learns from labeled training data
- **Unsupervised Learning**: The algorithm finds hidden patterns in unlabeled data
- **Reinforcement Learning**: The algorithm learns by interacting with an environment

### Example: Linear Regression

\`\`\`python
from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
\`\`\`

### Why Machine Learning Matters

1. Automates decision-making processes
2. Handles complex, high-dimensional data
3. Continuously improves with more data
4. Powers innovations across industries
`;

const sidebarLessons = [
  { title: "What is Machine Learning?", active: true },
  { title: "Types of ML", active: false },
  { title: "ML Applications", active: false },
  { title: "Linear Regression", active: false },
  { title: "Logistic Regression", active: false },
];

const LessonReader = () => {
  const [completed, setCompleted] = useState(false);
  const [progress] = useState(45);

  return (
    <DashboardLayout>
      <div className="flex flex-1 overflow-hidden">
        {/* Lesson Sidebar */}
        <aside className="w-64 border-r border-border p-4 hidden lg:block overflow-y-auto bg-card">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Lessons</h3>
          <div className="space-y-1">
            {sidebarLessons.map((l) => (
              <Link key={l.title} to="#"
                className={`block text-sm p-2 rounded-lg transition-colors ${
                  l.active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {l.title}
              </Link>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Reading Progress */}
          <div className="sticky top-0 z-10">
            <Progress value={progress} className="h-1 rounded-none" />
          </div>

          <div className="p-6 max-w-3xl mx-auto">
            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              <Link to="/tutor">
                <Button size="sm" variant="outline"><MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Ask AI Tutor</Button>
              </Link>
              <Button size="sm" variant="outline"><Sparkles className="h-3.5 w-3.5 mr-1.5" /> Simplify Concept</Button>
              <Link to="/quiz">
                <Button size="sm" variant="outline"><BookOpen className="h-3.5 w-3.5 mr-1.5" /> Take Quiz</Button>
              </Link>
              <Button
                size="sm"
                onClick={() => setCompleted(!completed)}
                className={completed ? "bg-success text-success-foreground border-0" : ""}
                variant={completed ? "default" : "outline"}
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                {completed ? "Completed" : "Mark Complete"}
              </Button>
            </motion.div>

            {/* Lesson Title */}
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-3xl font-bold mb-8"
            >
              What is Machine Learning?
            </motion.h1>

            {/* Markdown Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-sm max-w-none
                prose-headings:font-display prose-headings:text-foreground
                prose-p:text-foreground/80 prose-p:leading-relaxed
                prose-strong:text-foreground
                prose-code:bg-muted prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl
                prose-li:text-foreground/80
                prose-ul:text-foreground/80
                prose-ol:text-foreground/80
              "
            >
              <ReactMarkdown>{lessonContent}</ReactMarkdown>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LessonReader;
