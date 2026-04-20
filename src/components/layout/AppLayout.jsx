import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import FloatingBackground from '../ui/FloatingBackground';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen relative bg-transparent">
      <FloatingBackground />
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
