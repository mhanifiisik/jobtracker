import { useSession } from '@/utils/use-session'
import { Navigate, Outlet } from 'react-router'
import Sidebar from './sidabar'
import Loading from './ui/loading'
import { Suspense } from 'react'

const PageLayout = () => {
  const { session } = useSession()

  if (!session) {
    return <Navigate to="/auth" />
  }

  return (
    <main className="bg-background text-foreground flex min-h-screen">
      <div className="h-screen">
        <Sidebar />
      </div>
      <div className="h-screen flex-1 overflow-x-hidden overflow-y-auto p-4 transition-all duration-300">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </main>
  )
}

export default PageLayout
