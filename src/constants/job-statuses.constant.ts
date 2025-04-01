import type { Enums } from '@/types/database';

export type JobStatus = Enums<'job_status'>;

export const JOB_STATUSES: JobStatus[] = [
  'applied',
  'archived',
  'interviewing',
  'new',
  'offered',
  'rejected',
  'saved',
  'withdrawn',
];
