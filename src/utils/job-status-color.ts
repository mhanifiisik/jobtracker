import type { Job } from '@/types/db-tables';

export const getStatusColor = (status: Job['status']): string => {
  switch (status) {
    case 'new':
      return 'bg-primary text-primary-dark';
    case 'applied':
      return 'bg-warning text-warning-dark';
    case 'saved':
      return 'bg-info text-info-dark';
    case 'interviewing':
      return 'bg-secondary text-secondary-dark';
    case 'offered':
      return 'bg-success text-success-dark';
    case 'rejected':
      return 'bg-danger text-danger-dark';
    case 'archived':
      return 'bg-muted text-muted-dark';
    case 'withdrawn':
      return 'bg-muted text-muted-dark';
    default:
      return 'bg-muted text-muted-dark';
  }
};
