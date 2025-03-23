export const JOB_STATUSES = {
  OPEN: 'open',
  FILLED: 'filled',
  CLOSED: 'closed',
  DRAFT: 'draft',
  EXPIRED: 'expired',
} as const;

export type JobStatus = (typeof JOB_STATUSES)[keyof typeof JOB_STATUSES];
