import type { TableRow } from '@/types/db-tables';

export const JOB_STATUS: TableRow<'jobs'>['status'][] = [
  'new',
  'applied',
  'interviewing',
  'offered',
  'rejected',
  'archived',
  'withdrawn',
];
