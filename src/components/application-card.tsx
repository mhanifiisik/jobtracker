import { formatDate } from '@/utils/format-date';
import { getStatusColor } from '@/utils/job-status-color';
import { Building, MessageCircle } from 'lucide-react';
import Card from './ui/card';
import { type Tables } from '@/types/db-tables';
import { JobStatusLabels } from '@/utils/job-status-mapper';

interface ApplicationCardProps {
  application: Tables['job_applications']['Row'];
  onDelete?: (id: number) => void;
}

export default function ApplicationCard({ application, onDelete }: ApplicationCardProps) {
  const statusLabel = JobStatusLabels[application.status];

  return (
    <Card
      title={application.position_title}
      subtitle={application.company_name}
      description={'JOB DESCRIPTION'}
      icon={Building}
      status={{
        label: statusLabel,
        color: getStatusColor(application.status),
      }}
      date={application.created_at ? formatDate(new Date(application.created_at)) : ''}
      location={application.location}
      onDelete={() => onDelete?.(application.id)}
    >
      <div className="flex items-center gap-4">
        {application.response_date && (
          <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
            <MessageCircle className="h-4 w-4" />
            Interview:{' '}
            {application.response_date ? formatDate(new Date(application.response_date)) : ''}
          </span>
        )}
      </div>
    </Card>
  );
}
