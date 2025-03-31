import { useEffect, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Building2 } from 'lucide-react';
import type { Tables } from '@/types/database';
import { useApplicationsStore } from '@/store/applications';

type JobApplication = Tables<'job_applications'>;
type JobStatus = JobApplication['status'];

interface ApplicationDisplay {
  id: number;
  company_name: string;
  position: string;
  location: string;
  status: JobStatus;
  applied_date: string;
}

function RecentApplications() {

  const { recentApplications,fetchRecentApplications: fetchRecentApplications} = useApplicationsStore();

  useEffect(() => {
    void fetchRecentApplications();
  }, [fetchRecentApplications]);

  const applications = useMemo(() => {
    if (!recentApplications) return [];

    return recentApplications.map(app => ({
      id: app.id,
      company_name: app.company_name,
      position: app.position_title,
      location: app.location,
      status: app.status,
      applied_date: app.date_applied,
    })) as ApplicationDisplay[];
  }, [recentApplications]);

  const getStatusColor = (status: Tables<'job_applications'>['status']) => {
    switch (status) {
      case 'interviewing':
        return 'text-blue-500 bg-blue-100';
      case 'saved':
        return 'text-purple-500 bg-purple-100';
      case 'applied':
        return 'text-yellow-500 bg-yellow-100';
      case 'offered':
        return 'text-green-500 bg-green-100';
      case 'rejected':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-card border border-border">
      <div className="divide-border divide-y">
        {applications.length > 0 ? (
          applications.map(app => (
            <div key={app.id} className="hover:bg-muted/50 p-4 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-lg dark:bg-primary/25">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{app.position}</h4>
                    <p className="text-muted-foreground text-sm">{app.company_name}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="text-muted-foreground flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4" />
                  {app.location}
                </div>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(app.status)}`}
                >
                  {app.status}
                </span>
                <time dateTime={app.applied_date} className="text-muted-foreground text-sm">
                  {formatDistanceToNow(new Date(app.applied_date), { addSuffix: true })}
                </time>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground p-6 text-center">
            No applications found. Start applying for jobs to see them here.
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentApplications;
