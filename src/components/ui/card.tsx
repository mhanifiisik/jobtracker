import { Calendar, MapPin, Trash2, type LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  status?: {
    label: string;
    color: string;
  };
  date?: string;
  location?: string;
  onDelete?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export default function Card({
  title,
  subtitle,
  description,
  icon: Icon,
  status,
  date,
  location,
  onDelete,
  children,
  className = '',
}: CardProps) {
  return (
    <div className={`bg-card text-card-foreground rounded-lg border p-4 shadow-sm ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div>
            <h3 className="font-semibold">{title}</h3>
            {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
          </div>
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-destructive hover:text-destructive/80 rounded-full p-1 transition-colors hover:bg-destructive/10  hover:border hover:border-destructive hover:cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {description && <p className="mt-2 text-sm">{description}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        {status && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${status.color}`}
          >
            {status.label}
          </span>
        )}
        {date && (
          <span className="text-muted-foreground flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {date}
          </span>
        )}
        {location && (
          <span className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {location}
          </span>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
