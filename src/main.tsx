import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './global.css'
import App from './App.tsx'
import Dashboard from './pages/dashboard/index.tsx'
import Analytics from './pages/dashboard/analytics/index.tsx'
import Applications from './pages/dashboard/applications/index.tsx'
import Supplements from './pages/dashboard/supplements/index.tsx'
import Tracking from './pages/dashboard/tracking/index.tsx'
import PageLayout from './components/layout.tsx'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthPage from './pages/auth/index.tsx'
import NotFoundPage from './pages/not-found.tsx'
import { SessionProvider } from './utils/session-provider.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <BrowserRouter>
          <Routes>
            <Route index element={<App />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="dashboard" element={<PageLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="applications" element={<Applications />} />
              <Route path="supplements" element={<Supplements />} />
              <Route path="tracking" element={<Tracking />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </QueryClientProvider>
  </Provider>
)
