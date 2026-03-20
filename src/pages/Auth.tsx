import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, Lock, User, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const loginData = new FormData();
        loginData.append("username", formData.username);
        loginData.append("password", formData.password);
        await api.login(loginData);
        toast.success("Welcome back!");
      } else {
        await api.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        toast.success("Account created! Please log in.");
        setIsLogin(true);
        setLoading(false);
        return;
      }
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="gradient-bg rounded-xl p-2">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              Xynova.ai
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? "Enter your credentials to access your learning dashboard."
              : "Join Xynova and start mastering any concept with AI."}
          </p>
        </div>

        <div className="glass-card p-8 border border-white/10 shadow-2xl backdrop-blur-2xl rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  placeholder="johndoe"
                  className="pl-10 h-11 bg-white/5 border-white/10 focus:border-purple-500/50"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10 h-11 bg-white/5 border-white/10 focus:border-purple-500/50"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-white/5 border-white/10 focus:border-purple-500/50"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 gradient-bg border-0 text-primary-foreground font-bold rounded-xl mt-4 shadow-lg shadow-purple-500/20"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Log In" : "Sign Up"} <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 font-bold hover:underline"
            >
              {isLogin ? "Create one" : "Log in"}
            </button>
          </div>
        </div>

        {!isLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 flex items-center gap-3"
          >
            <Sparkles className="h-5 w-5 text-purple-400 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Get 5 free AI-generated topics instantly upon registration. No credit card required.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
