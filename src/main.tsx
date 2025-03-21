import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './global.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from './utils/session-provider'
import { ToastContainer } from 'react-toastify'
import App from './App'
import AuthPage from './pages/auth'
import NotFoundPage from './pages/not-found'
import PageLayout from './components/layout'
import DashboardPage from './pages/dashboard'
import Applications from './pages/dashboard/applications'
import LeetCodePage from './pages/dashboard/leetcode'
import DocumentsPage from './pages/dashboard/documents'
import JobsPage from './pages/dashboard/jobs'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />
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
  </QueryClientProvider>
)
