import type { JobStatus } from '@/constants/job-status.enum';

export interface Application {
  id: number;
  user_id: string;
  company_name: string;
  position_title: string;
  location: string | null;
  status: JobStatus;
  date_applied: Date;
  response_date: Date | null;
  created_at: Date;
  updated_at: Date;
  job_id: number | null;
  notes: string | null;
}
