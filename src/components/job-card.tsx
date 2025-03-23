import type { JobListing } from '@/types/job-listing';
import { formatDate } from '@/utils/format-date';
import { getStatusColor } from '@/utils/job-status-color';
import { JobStatusLabels } from '@/utils/job-status-mapper';
import { Building, Calendar, Clock, ExternalLink, MapPin, Trash2 } from 'lucide-react';

interface JobCardProps {
  job: JobListing;
  onDelete?: (id: number) => void;
}

export const JobCard = ({ job, onDelete }: JobCardProps) => {
  return (
    <div
      key={job.id}
      className="group border-border bg-card overflow-hidden rounded-lg border transition-all duration-200 hover:shadow-md"
    >
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold">
              {job.company.split('').slice(0, 2).join('').toUpperCase()}
            </div>
            <div>
              <h3 className="text-foreground text-lg font-medium">{job.company}</h3>
              <p className="text-muted-foreground text-sm">{job.position}</p>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(job.status)}`}
          >
            {JobStatusLabels[job.status]}
          </span>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
          {job.description || 'No description available.'}
        </p>

        <div className="text-muted-foreground grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{job.location || 'Remote'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="truncate">Applied: {formatDate(job.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="truncate">Posted: {formatDate(job.published_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="truncate">Updated: {formatDate(job.updated_at)}</span>
          </div>
        </div>
      </div>

      <div className="divide-border border-border mt-4 flex divide-x border-t">
        <button
          type="button"
          className="text-primary hover:bg-accent flex flex-1 items-center justify-center gap-2 p-3 text-sm font-medium transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          View Details
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(job.id)}
          className="text-destructive hover:bg-destructive/10 flex flex-1 items-center justify-center gap-2 p-3 text-sm font-medium transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
