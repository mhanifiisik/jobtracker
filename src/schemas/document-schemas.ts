import { DOCUMENT_TYPES } from '@/constants/document-types';
import * as yup from 'yup';

export const documentSchema = yup.object({
  user_id: yup.string().required('User ID is required'),
  title: yup.string().required('Document title is required'),
  content: yup.string().optional(),
  doc_type: yup
    .string()
    .oneOf(Object.values(DOCUMENT_TYPES), 'Please select a valid document type')
    .required('Document type is required'),
  url: yup.string().url('Please enter a valid URL').optional(),
});

export type DocumentFormValues = yup.InferType<typeof documentSchema>;
