import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ContentProvider } from './context/ContentContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';

// Lazy load actual pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const IdeaVault = React.lazy(() => import('./pages/IdeaVault'));
const ScriptBuilder = React.lazy(() => import('./pages/ScriptBuilder'));
const EditingHub = React.lazy(() => import('./pages/EditingHub'));
const ContentCalendar = React.lazy(() => import('./pages/ContentCalendar'));
const ContentManager = React.lazy(() => import('./pages/ContentManager'));
const GrowthLab = React.lazy(() => import('./pages/GrowthLab'));
const Monetization = React.lazy(() => import('./pages/Monetization'));
const Community = React.lazy(() => import('./pages/Community'));
const LearningHub = React.lazy(() => import('./pages/LearningHub'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Settings = React.lazy(() => import('./pages/Settings'));

const LoadingFallback = () => (
    <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ContentProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<AppLayout />}>
                <Route index element={
                    <Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>
                } />
                <Route path="ideas" element={
                    <Suspense fallback={<LoadingFallback />}><IdeaVault /></Suspense>
                } />
                <Route path="scripts" element={
                    <Suspense fallback={<LoadingFallback />}><ScriptBuilder /></Suspense>
                } />
                <Route path="editing" element={
                    <Suspense fallback={<LoadingFallback />}><EditingHub /></Suspense>
                } />
                <Route path="calendar" element={
                    <Suspense fallback={<LoadingFallback />}><ContentCalendar /></Suspense>
                } />
                <Route path="manager" element={
                    <Suspense fallback={<LoadingFallback />}><ContentManager /></Suspense>
                } />
                <Route path="growth" element={
                    <Suspense fallback={<LoadingFallback />}><GrowthLab /></Suspense>
                } />
                <Route path="monetization" element={
                    <Suspense fallback={<LoadingFallback />}><Monetization /></Suspense>
                } />
                <Route path="community" element={
                    <Suspense fallback={<LoadingFallback />}><Community /></Suspense>
                } />
                <Route path="learning" element={
                    <Suspense fallback={<LoadingFallback />}><LearningHub /></Suspense>
                } />
                <Route path="analytics" element={
                    <Suspense fallback={<LoadingFallback />}><Analytics /></Suspense>
                } />
                <Route path="settings" element={
                    <Suspense fallback={<LoadingFallback />}><Settings /></Suspense>
                } />
              </Route>
            </Routes>
          </Router>
        </ContentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
