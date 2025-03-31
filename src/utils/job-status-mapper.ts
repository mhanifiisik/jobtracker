import type { Tables } from '@/types/database';

export const JobStatusLabels: Record<NonNullable<Tables<'jobs'>['status']>, string> = {
  new: 'New',
  applied: 'Applied',
  saved: 'Saved',
  interviewing: 'Interviewing',
  offered: 'Offered',
  rejected: 'Rejected',
  archived: 'Archived',
  withdrawn: 'Withdrawn',
};
