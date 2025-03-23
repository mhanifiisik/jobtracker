import { JobStatus } from '../constants/job-status.enum';

export const JobStatusLabels: Record<JobStatus, string> = {
  [JobStatus.New]: 'New',
  [JobStatus.Applied]: 'Applied',
  [JobStatus.InInterview]: 'In Interview',
  [JobStatus.OnWishlist]: 'On Wishlist',
  [JobStatus.Rejected]: 'Rejected',
  [JobStatus.ReadyForReview]: 'Ready for Review',
};
