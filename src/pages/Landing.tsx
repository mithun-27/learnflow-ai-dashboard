import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Brain, MessageSquare, Network, BarChart3,
  Sparkles, ArrowRight, CheckCircle2, Zap, Star, Github
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const }
  })
};

const features = [
  { icon: Brain, title: "AI Topic Roadmap Generator", desc: "Automatically breaks any topic into structured units and lessons." },
  { icon: MessageSquare, title: "AI Tutor Chat", desc: "Ask questions and get explanations from an AI tutor." },
  { icon: Sparkles, title: "Quiz Generator", desc: "Test your understanding with AI-generated quizzes." },
  { icon: Network, title: "Knowledge Graph Mindmaps", desc: "Visualize how concepts connect." },
  { icon: BarChart3, title: "Learning Analytics", desc: "Track progress, quiz scores, and learning streaks." },
];

const steps = [
  { num: "01", title: "Enter any topic", desc: "Type in what you want to learn." },
  { num: "02", title: "AI generates a roadmap", desc: "Get a structured learning path instantly." },
  { num: "03", title: "Study lessons & explore", desc: "Read AI-generated lessons with rich content." },
  { num: "04", title: "Quiz & track progress", desc: "Take quizzes and monitor your growth." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="gradient-bg rounded-lg p-1.5">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">LearnFlow AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="gradient-bg border-0 text-primary-foreground">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 gradient-hero-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" /> Powered by AI
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            >
              Master Any Concept{" "}
              <span className="gradient-text">with AI</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Generate structured learning roadmaps, read lessons, take quizzes,
              and track your progress using AI.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="gradient-bg border-0 text-primary-foreground px-8 h-12 text-base">
                  Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/topics">
                <Button size="lg" variant="outline" className="px-8 h-12 text-base">
                  Try Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            variants={fadeUp} custom={4}
            initial="hidden" animate="visible"
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="glass-card p-6 rounded-2xl">
              <div className="bg-muted rounded-xl p-8 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>AI is generating your learning roadmap...</span>
                </div>
                <div className="w-full max-w-md space-y-3">
                  {["Introduction to Machine Learning", "Supervised Learning", "Neural Networks", "Deep Learning"].map((t, i) => (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.2 }}
                      className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border"
                    >
                      <div className="gradient-bg rounded-md p-1.5 shrink-0">
                        <BookOpen className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                      <span className="text-sm font-medium">{t}</span>
                      <CheckCircle2 className="h-4 w-4 text-success ml-auto" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to <span className="gradient-text">learn smarter</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              AI-powered tools that adapt to your learning style.
            </motion.p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp} custom={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="glass-card p-6 hover-lift group cursor-default"
              >
                <div className="gradient-bg rounded-xl p-3 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </motion.h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                variants={fadeUp} custom={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl font-extrabold gradient-text mb-4">{s.num}</div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </motion.h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="glass-card p-8 flex flex-col"
            >
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-extrabold mb-6">$0<span className="text-base font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                {["5 topics per month", "Limited AI tutor chat", "Basic quizzes", "Study checklist"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </motion.div>
            {/* Premium */}
            <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="glass-card p-8 flex flex-col border-primary/30 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 gradient-bg text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-extrabold mb-6">$12<span className="text-base font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Unlimited topics", "Unlimited AI tutor", "Advanced quizzes", "Knowledge graphs", "Learning analytics"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/dashboard">
                <Button className="w-full gradient-bg border-0 text-primary-foreground">Upgrade Now</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="gradient-bg rounded-lg p-1.5">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">LearnFlow AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              <a href="#" className="hover:text-foreground transition-colors"><Github className="h-4 w-4" /></a>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 LearnFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
