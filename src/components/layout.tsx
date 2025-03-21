import { useSession } from "@/utils/use-session"
import { Navigate, Outlet } from "react-router"
import Sidebar from "./sidabar"
import Loading from "./ui/loading"
import { Suspense } from "react"

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
      <div className="flex-1 p-4 h-screen transition-all duration-300 overflow-x-hidden overflow-y-auto">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </main>
  )
}

export default PageLayout
