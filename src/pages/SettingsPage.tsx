
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Moon, Sun, RefreshCw, Bell, Lock, HelpCircle, User } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [autoLock, setAutoLock] = useState(true);
  
  const handleReset = () => {
    toast.success("App has been reset to default settings");
  };
  
  return (
    <div className="container mx-auto max-w-md">
      <div className="mb-6 flex items-center">
        <Link to="/" className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="space-y-6">
        <div className="crypto-card p-4">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <Label htmlFor="theme-toggle">Dark Mode</Label>
            </div>
            <Switch 
              id="theme-toggle" 
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </div>
        </div>
        
        <div className="crypto-card p-4 space-y-4">
          <h2 className="text-lg font-semibold">Preferences</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <Label htmlFor="notifications">Notifications</Label>
            </div>
            <Switch 
              id="notifications" 
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5" />
              <Label htmlFor="biometrics">Biometric Authentication</Label>
            </div>
            <Switch 
              id="biometrics" 
              checked={biometrics}
              onCheckedChange={setBiometrics}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5" />
              <Label htmlFor="autolock">Auto-lock</Label>
            </div>
            <Switch 
              id="autolock" 
              checked={autoLock}
              onCheckedChange={setAutoLock}
            />
          </div>
        </div>
        
        <div className="crypto-card p-4 space-y-4">
          <h2 className="text-lg font-semibold">Account</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center justify-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </Button>
            
            <Button variant="outline" className="flex items-center justify-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Support
            </Button>
          </div>
          
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={handleReset}
          >
            Reset App
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
