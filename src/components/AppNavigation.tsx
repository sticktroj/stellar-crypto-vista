
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { 
  Home, 
  Send, 
  Download, 
  RefreshCw, 
  Settings, 
  Moon, 
  Sun,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppNavigation() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/send", label: "Send", icon: Send },
    { path: "/receive", label: "Receive", icon: Download },
    { path: "/swap", label: "Swap", icon: RefreshCw },
    { path: "/settings", label: "Settings", icon: Settings },
  ];
  
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-10 p-2 md:relative",
      "dark:bg-wallet-dark md:dark:bg-transparent",
      "bg-white md:bg-transparent",
      "border-t md:border-t-0 border-border"
    )}>
      {isMobile ? (
        <div className="flex justify-between">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex flex-col items-center p-2 rounded-md transition-colors",
                location.pathname === item.path 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-6 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Stellar Crypto</h1>
            <Button
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
          
          <div className="space-y-1">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md transition-colors",
                  location.pathname === item.path 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="mt-auto pt-6">
            <Button
              variant="outline"
              className="w-full"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Support
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
