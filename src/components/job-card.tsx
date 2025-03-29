import { formatDate } from '@/utils/format-date';
import { Building, ExternalLink } from 'lucide-react';
import Card from './ui/card';
import { type Tables } from '@/types/db-tables';
import { JobStatusForm } from './ui/job-status-form';

interface JobCardProps {
  job: Tables['jobs']['Row'];
  onDelete: () => void;
}

export default function JobCard({ job, onDelete }: JobCardProps) {
  const formattedDate = job.created_at ? formatDate(new Date(job.created_at)) : '';

  return (
    <Card
      title={job.position}
      subtitle={job.company}
      description={job.description ?? ''}
      icon={Building}
      status={{
        label: job.status ?? '',
        color: 'bg-blue-500',
      }}
      date={formattedDate}
      location={job.location ?? ''}
      onDelete={onDelete}
    >
      <div className="space-y-4">
        {job.source_url && (
          <a
            href={job.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm"
          >
            <ExternalLink className="h-4 w-4" />
            View Job
          </a>
        )}
        <JobStatusForm jobId={job.id.toString()} />
      </div>
    </Card>
  );
}
