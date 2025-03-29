import { JOB_STATUSES } from '@/constants/job-statuses';
import { string, ref, object, date, number, type InferType } from 'yup';

export const jobSchema = object({
  title: string().required('Job title is required'),
  company: string().required('Company name is required'),
  location: string().optional(),
  description: string().optional(),
  url: string().url('Please enter a valid URL').optional(),
  salary_min: number().positive('Salary must be a positive number').optional(),
  salary_max: number()
    .positive('Salary must be a positive number')
    .min(ref('salary_min'), 'Maximum salary must be greater than minimum salary')
    .optional(),
  status: string()
    .oneOf(Object.values(JOB_STATUSES), 'Please select a valid job status')
    .required('Job status is required'),
  posted_date: date().max(new Date(), 'Posted date cannot be in the future').optional(),
  deadline: date()
    .min(ref('posted_date'), 'Deadline cannot be earlier than posted date')
    .optional(),
});

export type JobFormValues = InferType<typeof jobSchema>;
