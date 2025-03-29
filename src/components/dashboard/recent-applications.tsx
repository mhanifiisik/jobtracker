import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Building2 } from 'lucide-react';
import { useFetchData } from '@/hooks/use-fetch-data';
import { useSession } from '@/hooks/use-session';
import type { Database } from '@/types/database';

type JobApplication = Database['public']['Tables']['job_applications']['Row'];
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
  const { session } = useSession();
  const userId = session?.user.id;

  const { data: applicationsData } = useFetchData('job_applications', {
    userId,
    select: 'id,company_name,position_title,location,status,date_applied',
    order: 'desc',
    limit: 5,
  });

  const applications = useMemo(() => {
    if (!applicationsData) return [];

    return applicationsData.map(app => ({
      id: app.id,
      company_name: app.company_name,
      position: app.position_title,
      location: app.location,
      status: app.status,
      applied_date: app.date_applied,
    })) as ApplicationDisplay[];
  }, [applicationsData]);

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'applied':
        return 'bg-accent/20 text-accent-foreground dark:bg-accent/30';
      case 'rejected':
        return 'bg-destructive/20 text-destructive-foreground dark:bg-destructive/30';
      case 'in interview':
        return 'bg-primary/20 text-primary-foreground dark:bg-primary/30';
      case 'on wishlist':
        return 'bg-secondary/20 text-secondary-foreground dark:bg-secondary/30';
      case 'ready for review':
        return 'bg-muted text-muted-foreground dark:bg-muted/50';
      default:
        return 'bg-muted text-muted-foreground dark:bg-muted/50';
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
