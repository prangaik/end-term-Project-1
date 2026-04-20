import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Lightbulb, PenTool, Calendar as CalendarIcon, Kanban, BarChart3, Settings, LogOut, Sun, Moon, Video, TrendingUp, DollarSign, Users, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Idea Vault', path: '/ideas', icon: Lightbulb },
    { name: 'Script Builder', path: '/scripts', icon: PenTool },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { name: 'Content Manager', path: '/manager', icon: Kanban },
    { name: 'Growth Lab', path: '/growth', icon: TrendingUp },
    { name: 'Monetization', path: '/monetization', icon: DollarSign },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Learning Hub', path: '/learning', icon: GraduationCap },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Editing Hub', path: '/editing', icon: Video },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card px-4 py-6 text-card-foreground">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
          S
        </div>
        <span className="text-xl font-bold tracking-wider">ShowTime</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between px-2 text-sm text-muted-foreground">
            <span className="truncate pr-2">{user?.email}</span>
            <button onClick={toggleTheme} className="hover:text-primary transition-colors">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
        </div>
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
