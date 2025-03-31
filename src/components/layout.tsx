import { Link, Navigate, Outlet, useLocation } from 'react-router';
import Sidebar from './sidebar';
import Loader from './ui/loading';
import { Suspense } from 'react';
import { useAuthStore } from '@/store/auth';
import { ChevronRight, Home } from 'lucide-react';

const PageLayout = () => {
  const session = useAuthStore(state => state.session);
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  if (!session) {
    return <Navigate to="/auth" />;
  }

  return (
    <main className="bg-background text-foreground flex min-h-screen">
      <div className="h-screen">
        <Sidebar />
      </div>
      <div className="h-screen flex-1 overflow-x-hidden overflow-y-auto p-4 transition-all duration-300">
        <Suspense fallback={<Loader />}>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                >
                  <Home className="me-2.5 h-4 w-4" />
                  Home
                </Link>
              </li>
              {pathSegments.map((segment, index) => {
                const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
                const isLast = index === pathSegments.length - 1;
                return (
                  <li key={path} className="flex items-center">
                    <ChevronRight className="mx-1 h-4 w-4 text-gray-400 rtl:rotate-180" />
                    {isLast ? (
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                      </span>
                    ) : (
                      <Link
                        to={path}
                        className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                      >
                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <Outlet />
        </Suspense>
      </div>
    </main>
  );
};

export default PageLayout;
