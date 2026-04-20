import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Bell, Moon, Sun, CheckCircle } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [profileName, setProfileName] = useState(user?.displayName || "Creator Name");
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate network request
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-8 relative z-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your workspace and profile preferences.</p>
      </div>

      {showToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-white shadow-lg animate-in slide-in-from-top-4">
          <CheckCircle size={18} />
          <span className="text-sm font-medium">Settings saved successfully!</span>
        </div>
      )}

      <div className="grid gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 border-b border-border bg-muted/30 pb-4">
             <User className="text-primary" size={20} />
             <CardTitle className="text-lg">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)} 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input value={user?.email || ""} disabled className="bg-muted/50 cursor-not-allowed opacity-70" />
                </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 border-b border-border bg-muted/30 pb-4">
             {theme === 'dark' ? <Moon className="text-primary" size={20} /> : <Sun className="text-primary" size={20} />}
             <CardTitle className="text-lg">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
                <p className="font-medium">Theme Preference</p>
                <p className="text-sm text-muted-foreground">Switch between high-contrast dark mode and our new signature Light Pink aesthetic.</p>
            </div>
            <Button variant="outline" onClick={toggleTheme}>
                {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 border-b border-border bg-muted/30 pb-4">
             <Bell className="text-primary" size={20} />
             <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border last:border-0 last:pb-0">
                <div className="space-y-0.5">
                    <p className="font-medium text-sm">Deadline Reminders</p>
                    <p className="text-xs text-muted-foreground">Get notified when a content piece is due soon.</p>
                </div>
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="h-4 w-4 rounded border-primary text-primary focus:ring-primary accent-primary" 
                  onChange={handleSaveProfile}
                />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border last:border-0 last:pb-0">
                <div className="space-y-0.5">
                    <p className="font-medium text-sm">Weekly Report</p>
                    <p className="text-xs text-muted-foreground">Receive a weekly summary of your production board.</p>
                </div>
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="h-4 w-4 rounded border-primary text-primary focus:ring-primary accent-primary" 
                  onChange={handleSaveProfile}
                />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
