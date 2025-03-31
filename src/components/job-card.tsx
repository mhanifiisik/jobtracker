import { formatDate } from '@/utils/format-date';
import { Building, ExternalLink, MapPin, Calendar, Briefcase } from 'lucide-react';
import Card from './ui/card';
import type { Tables } from '@/types/database';
import { getStatusColor } from '@/utils/job-status-color';
import { StatusForm } from './ui/status-form';
import { useJobsStore } from '@/store/jobs';
import { JobStatusLabels } from '@/utils/job-status-mapper';

interface JobCardProps {
  job: Tables<'jobs'>;
  onDelete: () => void;
}

export default function JobCard({ job, onDelete }: JobCardProps) {
  const formattedDate = job.created_at ? formatDate(new Date(job.created_at)) : '';

  const { updateJob } = useJobsStore();
  const statusColor = getStatusColor(job.status);

  const handleStatusChange = async (id: string, status: NonNullable<Tables<'jobs'>['status']>) => {
    await updateJob(Number(id), { status });
  };

  return (
    <Card
      title={job.position}
      subtitle={job.company}
      className="group transition-all duration-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">
              {job.position}
            </h3>
            <p className="text-muted-foreground text-sm">{job.company}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-full p-1.5 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      {job.description && (
        <p className="text-muted-foreground mt-3 line-clamp-2 text-sm">{job.description}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColor}`}
        >
          <Briefcase className="mr-1 h-3 w-3" />
          {job.status ?? 'New'}
        </span>
        {job.location && (
          <span className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {job.location}
          </span>
        )}
        <span className="text-muted-foreground flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {formattedDate}
        </span>
      </div>

      <div className="mt-4 border-t pt-4">
        <StatusForm
          id={job.id.toString()}
          options={Object.entries(JobStatusLabels).map(([value, label]) => ({
            value,
            label,
          }))}
          initialStatus={job.status ?? 'new'}
          onStatusChange={handleStatusChange}
        />
      </div>
    </Card>
  );
}
