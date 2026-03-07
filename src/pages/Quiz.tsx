import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";

const questions = [
  {
    question: "What is Machine Learning?",
    options: [
      "A way to explicitly program every rule",
      "A subset of AI that learns from data",
      "A database management technique",
      "A type of operating system"
    ],
    correct: 1,
    explanation: "Machine Learning is a subset of AI where systems learn patterns from data rather than being explicitly programmed."
  },
  {
    question: "Which type of learning uses labeled data?",
    options: ["Unsupervised Learning", "Reinforcement Learning", "Supervised Learning", "Transfer Learning"],
    correct: 2,
    explanation: "Supervised Learning uses labeled training data where both input and expected output are provided."
  },
  {
    question: "What does a neural network consist of?",
    options: [
      "Only input and output layers",
      "Layers of interconnected nodes",
      "A single processing unit",
      "Random data generators"
    ],
    correct: 1,
    explanation: "Neural networks consist of layers of interconnected nodes (neurons) including input, hidden, and output layers."
  },
];

const Quiz = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null) return;
    if (!submitted) {
      setSubmitted(true);
      return;
    }
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    if (isLast) {
      setShowResult(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setSubmitted(false);
  };

  const score = answers.filter((a, i) => a === questions[i].correct).length;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {showResult ? (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 text-center"
            >
              <div className="gradient-bg rounded-full p-4 w-fit mx-auto mb-4">
                <Trophy className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-4xl font-extrabold gradient-text mb-4">{score}/{questions.length}</p>
              <p className="text-muted-foreground mb-6">
                {score === questions.length ? "Perfect score! 🎉" : score >= questions.length / 2 ? "Good job! Keep learning." : "Keep practicing!"}
              </p>

              <div className="space-y-3 text-left mb-6">
                {questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                    {answers[i] === q.correct
                      ? <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                      : <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    }
                    <div>
                      <p className="text-sm font-medium">{q.question}</p>
                      <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={restart} className="gradient-bg border-0 text-primary-foreground">
                <RotateCcw className="h-4 w-4 mr-2" /> Retake Quiz
              </Button>
            </motion.div>
          ) : (
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Question {current + 1} of {questions.length}</span>
                  <span>{Math.round(((current) / questions.length) * 100)}%</span>
                </div>
                <Progress value={(current / questions.length) * 100} className="h-2" />
              </div>

              <div className="glass-card p-6">
                <h2 className="text-xl font-bold mb-6">{q.question}</h2>
                <div className="space-y-3">
                  {q.options.map((opt, i) => {
                    let style = "border border-border hover:border-primary/50 hover:bg-muted";
                    if (selected === i && !submitted) style = "border-2 border-primary bg-primary/5";
                    if (submitted && i === q.correct) style = "border-2 border-success bg-success/5";
                    if (submitted && selected === i && i !== q.correct) style = "border-2 border-destructive bg-destructive/5";

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        className={`w-full text-left p-4 rounded-xl transition-all text-sm ${style}`}
                      >
                        <span className="font-medium">{String.fromCharCode(65 + i)}.</span> {opt}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground"
                  >
                    {q.explanation}
                  </motion.div>
                )}

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleNext} disabled={selected === null} className="gradient-bg border-0 text-primary-foreground">
                    {!submitted ? "Check Answer" : isLast ? "See Results" : <>Next <ArrowRight className="ml-1 h-4 w-4" /></>}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Quiz;
