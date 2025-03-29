import { number, object, string, date, ref, type InferType } from 'yup';
import { APPLICATION_STATUSES } from '@/constants/application-statuses';

export const applicationSchema = object({
  job_id: number().required('Job is required'),
  user_id: string().required('User ID is required'),
  applied_date: date()
    .max(new Date(), 'Applied date cannot be in the future')
    .required('Applied date is required'),
  status: string()
    .oneOf(Object.values(APPLICATION_STATUSES), 'Please select a valid application status')
    .required('Application status is required'),
  notes: string().optional(),
  follow_up_date: date()
    .min(ref('applied_date'), 'Follow-up date cannot be earlier than applied date')
    .optional(),
  interview_date: date()
    .min(ref('applied_date'), 'Interview date cannot be earlier than applied date')
    .optional(),
});

export type ApplicationFormValues = InferType<typeof applicationSchema>;
