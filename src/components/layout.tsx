import { Navigate, Outlet } from 'react-router'
import { useSession } from '../utils/use-session'
import { Sidebar } from './sidabar'
import { Suspense } from 'react'

const PageLayout = () => {
  const { session } = useSession()

  if (!session) {
    return <Navigate to="/auth" />
  }

  return (
    <main className="bg-background text-foreground flex min-h-screen">
      <Sidebar />
      <div className="h-[95vh] w-full items-center overflow-x-hidden overflow-y-auto p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </main>
  )
}

export default PageLayout
