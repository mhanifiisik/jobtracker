import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from './utils/session-provider';
import { ThemeProvider } from './utils/theme-provider';
import { Toaster } from 'react-hot-toast';
import { lazy } from 'react';

const AppPage = lazy(() => import('./App'));
const AuthPage = lazy(() => import('./pages/auth'));
const NotFoundPage = lazy(() => import('./pages/not-found'));
const PageLayout = lazy(() => import('./components/layout'));
const DashboardPage = lazy(() => import('./pages/dashboard'));
const LeetCodePage = lazy(() => import('./pages/dashboard/leetcode'));
const Applications = lazy(() => import('./pages/dashboard/applications'));
const DocumentsPage = lazy(() => import('./pages/dashboard/documents'));
const JobsPage = lazy(() => import('./pages/dashboard/jobs'));

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <SessionProvider>
        <Toaster position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route index element={<AppPage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="dashboard" element={<PageLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="leetcode" element={<LeetCodePage />} />
              <Route path="applications" element={<Applications />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="jobs" element={<JobsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
