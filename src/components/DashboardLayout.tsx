import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, MessageSquare, HelpCircle,
  Network, BarChart3, Settings, Zap, LogOut
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Topics", url: "/topics", icon: BookOpen },
  { title: "AI Tutor", url: "/tutor", icon: MessageSquare },
  { title: "Quizzes", url: "/quiz", icon: HelpCircle },
  { title: "Knowledge Graph", url: "/knowledge-graph", icon: Network },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarContent className="pt-4">
            <div className="px-4 pb-4 flex items-center gap-2">
              <div className="gradient-bg rounded-lg p-1.5 shrink-0">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm group-data-[collapsible=icon]:hidden bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">Xynova.ai</span>
            </div>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const active = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.url}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                              active
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <div className="mt-auto px-3 pb-4">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-background/80 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h2 className="font-semibold text-sm truncate">
                {navItems.find(i => i.url === location.pathname)?.title || "Xynova.ai"}
              </h2>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
