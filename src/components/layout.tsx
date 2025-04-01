import { Outlet, useLocation } from 'react-router';
import Sidebar from './sidebar';
import Loader from './ui/loading';
import { Suspense } from 'react';
import { Breadcrumb } from './ui/breadcrumb';
import { useAuthStore } from '@/store/auth';
import { navItems } from '@/constants/navlinks.constant';

interface LayoutProps {
  showBreadcrumb?: boolean;
}

const PageLayout = ({ showBreadcrumb = true }: LayoutProps) => {
  const { user, signOut } = useAuthStore();
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  return (
    <main className="bg-background text-foreground flex min-h-screen">
      <div className="h-screen">
        <Sidebar navItems={navItems} onSignOut={() => signOut()} userEmail={user?.email} />
      </div>
      <div className="h-screen flex-1 overflow-x-hidden overflow-y-auto p-4 transition-all duration-300">
        <Suspense fallback={<Loader />}>
          {showBreadcrumb && <Breadcrumb pathSegments={pathSegments} />}
          <Outlet />
        </Suspense>
      </div>
    </main>
  );
};

export default PageLayout;
