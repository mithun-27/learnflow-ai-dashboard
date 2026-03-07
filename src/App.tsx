import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import TopicGenerator from "./pages/TopicGenerator";
import LessonReader from "./pages/LessonReader";
import AiTutor from "./pages/AiTutor";
import Quiz from "./pages/Quiz";
import KnowledgeGraph from "./pages/KnowledgeGraph";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/topics" element={<TopicGenerator />} />
          <Route path="/lesson/:id" element={<LessonReader />} />
          <Route path="/tutor" element={<AiTutor />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
