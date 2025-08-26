import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

function DashboardLayoutContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isDark, setTheme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header darkMode={isDark} toggleDarkMode={toggleDarkMode} />
      
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        
        <main 
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out pt-16 min-h-screen",
            sidebarCollapsed ? "ml-16" : "ml-64"
          )}
        >
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="libroshere-theme">
      <DashboardLayoutContent />
    </ThemeProvider>
  );
}