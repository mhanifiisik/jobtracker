import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './global.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from './utils/session-provider'
import { Toaster } from 'react-hot-toast'
import App from './App'
import AuthPage from './pages/auth'
import NotFoundPage from './pages/not-found'
import PageLayout from './components/layout'
import DashboardPage from './pages/dashboard'
import Applications from './pages/dashboard/applications'
import LeetCodePage from './pages/dashboard/leetcode'
import LeetCodeAddPage from './pages/dashboard/leetcode/add'
import LeetCodeCategoriesPage from './pages/dashboard/leetcode/categories'
import LeetCodeDetailPage from './pages/dashboard/leetcode/[id]'
import DocumentsPage from './pages/dashboard/documents'
import JobsPage from './pages/dashboard/jobs'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="dashboard" element={<PageLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="leetcode">
              <Route index element={<LeetCodePage />} />
              <Route path="add" element={<LeetCodeAddPage />} />
              <Route path="categories" element={<LeetCodeCategoriesPage />} />
              <Route path=":id" element={<LeetCodeDetailPage />} />
            </Route>
            <Route path="applications" element={<Applications />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="jobs" element={<JobsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  </QueryClientProvider>
)
