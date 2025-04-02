import type { Job } from '@/types/db-tables';

export const getStatusColor = (status: Job['status']): string => {
  switch (status) {
    case 'new':
      return 'bg-primary text-primary-foreground';
    case 'applied':
      return 'bg-warning text-warning-foreground';
    case 'saved':
      return 'bg-info text-info-foreground';
    case 'interviewing':
      return 'bg-secondary text-secondary-foreground';
    case 'offered':
      return 'bg-success text-success-foreground';
    case 'rejected':
      return 'bg-danger text-danger-foreground';
    case 'archived':
      return 'bg-muted text-muted-foreground';
    case 'withdrawn':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted';
  }
};
