import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Pill, Brain, Bell, FileText, BarChart3, Activity, Menu, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import octaviaLogo from "@/assets/octavia-logo.svg";
import octaviaIcon from "@/assets/octavia-icon.svg";
const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Analyses",
    href: "/analyses",
    icon: BarChart3,
  },
  {
    name: "Suivi et surveillance",
    href: "/monitoring",
    icon: Activity,
  },
  {
    name: "Prédictions",
    href: "/predictions",
    icon: Brain,
  },
  {
    name: "Interactions",
    href: "/interactions",
    icon: Pill,
  },
  {
    name: "Alertes",
    href: "/alerts",
    icon: Bell,
  },
  {
    name: "Rapports",
    href: "/reports",
    icon: FileText,
  },
];
interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar backdrop - only on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-sidebar transition-all duration-200  ${sidebarOpen ? "w-64 shadow-2xl" : "w-16"}`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="relative h-16 border-b border-sidebar-border bg-sidebar gap-0 mx-0 flex-row my-0 px-[10px] py-[10px] flex items-center justify-center">
            {sidebarOpen ? (
              <img src={octaviaLogo} alt="OCTAVIA" className="h-16 object-contain " />
            ) : (
              <img src={octaviaIcon} alt="OCTAVIA" className="h-20 w-20" />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent absolute right-4"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
                  onClick={() => setSidebarOpen(false)}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={`${sidebarOpen ? "opacity-100" : "opacity-0 w-0"} transition-all duration-300 overflow-hidden whitespace-nowrap`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-auto border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-3 py-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                ​R
              </div>
              {sidebarOpen && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-sidebar-foreground truncate">Dr. Rami CHAKER</span>
                  <span className="text-xs text-muted-foreground truncate">Infectiologue</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:pl-64" : "lg:pl-16"}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-6 shadow-sm bg-[#FDFBF9]">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">
              {currentTime.toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <Clock className="h-4 w-4" />
            <span className="text-foreground font-semibold">
              {currentTime.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
