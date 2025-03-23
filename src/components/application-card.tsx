import { formatDate } from '@/utils/format-date';
import { getStatusColor } from '@/utils/job-status-color';
import { JobStatusLabels } from '@/utils/job-status-mapper';
import { Building, Calendar, Link, MapPin, MessageCircle, Trash2 } from 'lucide-react';
import type { Application } from '@/types/application';

interface ApplicationCardProps {
  application: Application;
  onDelete?: (id: number) => void;
}

export default function ApplicationCard({ application, onDelete }: ApplicationCardProps) {
  return (
    <div className="group border-border bg-card overflow-hidden rounded-lg border transition-all duration-200 hover:shadow-md">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold">
              {application.company_name.split('').slice(0, 2).join('').toUpperCase()}
            </div>
            <div>
              <h3 className="text-foreground text-lg font-medium">{application.company_name}</h3>
              <p className="text-muted-foreground text-sm">{application.position_title}</p>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(application.status)}`}
          >
            {JobStatusLabels[application.status]}
          </span>
        </div>

        <div className="text-muted-foreground mb-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{application.location ?? 'Remote'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="truncate">
              Applied: {formatDate(new Date(application.date_applied))}
            </span>
          </div>
          {application.response_date && (
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="truncate">
                Response: {formatDate(new Date(application.response_date))}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="truncate">
              Updated: {formatDate(new Date(application.updated_at))}
            </span>
          </div>
        </div>
      </div>

      <div className="divide-border border-border mt-4 flex divide-x border-t">
        <button
          type="button"
          className="text-primary hover:bg-accent flex flex-1 items-center justify-center gap-2 p-3 text-sm font-medium transition-colors"
        >
          <Link className="h-4 w-4" />
          View Details
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(application.id)}
          className="text-destructive hover:bg-destructive/10 flex flex-1 items-center justify-center gap-2 p-3 text-sm font-medium transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
