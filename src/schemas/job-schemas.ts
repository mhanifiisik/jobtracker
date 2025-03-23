import { JOB_STATUSES } from '@/constants/job-statuses';
import * as yup from 'yup';

export const jobSchema = yup.object({
  title: yup.string().required('Job title is required'),
  company: yup.string().required('Company name is required'),
  location: yup.string().optional(),
  description: yup.string().optional(),
  url: yup.string().url('Please enter a valid URL').optional(),
  salary_min: yup.number().positive('Salary must be a positive number').optional(),
  salary_max: yup
    .number()
    .positive('Salary must be a positive number')
    .min(yup.ref('salary_min'), 'Maximum salary must be greater than minimum salary')
    .optional(),
  status: yup
    .string()
    .oneOf(Object.values(JOB_STATUSES), 'Please select a valid job status')
    .required('Job status is required'),
  posted_date: yup.date().max(new Date(), 'Posted date cannot be in the future').optional(),
  deadline: yup
    .date()
    .min(yup.ref('posted_date'), 'Deadline cannot be earlier than posted date')
    .optional(),
});

export type JobFormValues = yup.InferType<typeof jobSchema>;
