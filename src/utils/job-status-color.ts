import { JobStatus } from '../constants/job-status.enum';

export const getStatusColor = (status: JobStatus): string => {
  switch (status) {
    case JobStatus.New:
      return 'bg-primary text-primary-dark';
    case JobStatus.ReadyForReview:
      return 'bg-warning text-warning-dark';
    case JobStatus.Applied:
      return 'bg-info text-info-dark';
    case JobStatus.InInterview:
      return 'bg-secondary text-secondary-dark';
    case JobStatus.OnWishlist:
      return 'bg-success text-success-dark';
    case JobStatus.Rejected:
      return 'bg-danger text-danger-dark';
    default:
      return 'bg-muted text-muted-dark';
  }
};
