import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, MessageSquare, HelpCircle,
  Network, BarChart3, Settings, Zap, LogOut
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Topics", url: "/topics", icon: BookOpen },
  { title: "AI Tutor", url: "/tutor", icon: MessageSquare },
  { title: "Quizzes", url: "/quiz", icon: HelpCircle },
  { title: "Knowledge Graph", url: "/knowledge-graph", icon: Network },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "#", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarContent className="pt-4">
            <div className="px-4 pb-4 flex items-center gap-2">
              <div className="gradient-bg rounded-lg p-1.5 shrink-0">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm group-data-[collapsible=icon]:hidden">LearnFlow AI</span>
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
              <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <LogOut className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-4 bg-background/80 backdrop-blur-md sticky top-0 z-40">
            <SidebarTrigger className="mr-4" />
            <h2 className="font-semibold text-sm truncate">
              {navItems.find(i => i.url === location.pathname)?.title || "LearnFlow AI"}
            </h2>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
