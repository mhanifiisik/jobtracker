import type { Application } from '@/types/database';

export function calculateApplicationStats(applications: Application[] | null) {
  const totalApplications = applications?.length ?? 0;
  const pendingApplications =
    applications?.filter(app => app.status === 'applied' || app.status === 'in interview').length ??
    0;
  const rejectedApplications = applications?.filter(app => app.status === 'rejected').length ?? 0;
  const offeredApplications =
    applications?.filter(app => app.status === 'ready for review').length ?? 0;

  return { totalApplications, pendingApplications, rejectedApplications, offeredApplications };
}
