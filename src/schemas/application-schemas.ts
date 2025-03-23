import * as yup from 'yup';
import { APPLICATION_STATUSES } from '@/constants/application-statuses';

export const applicationSchema = yup.object({
  job_id: yup.number().required('Job is required'),
  user_id: yup.string().required('User ID is required'),
  applied_date: yup
    .date()
    .max(new Date(), 'Applied date cannot be in the future')
    .required('Applied date is required'),
  status: yup
    .string()
    .oneOf(Object.values(APPLICATION_STATUSES), 'Please select a valid application status')
    .required('Application status is required'),
  notes: yup.string().optional(),
  follow_up_date: yup
    .date()
    .min(yup.ref('applied_date'), 'Follow-up date cannot be earlier than applied date')
    .optional(),
  interview_date: yup
    .date()
    .min(yup.ref('applied_date'), 'Interview date cannot be earlier than applied date')
    .optional(),
});

export type ApplicationFormValues = yup.InferType<typeof applicationSchema>;
