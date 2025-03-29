import { DOCUMENT_TYPES } from '@/constants/document-types';
import { object, string, type InferType } from 'yup';

export const documentSchema = object({
  user_id: string().required('User ID is required'),
  title: string().required('Document title is required'),
  content: string().optional(),
  doc_type: string()
    .oneOf(Object.values(DOCUMENT_TYPES), 'Please select a valid document type')
    .required('Document type is required'),
  url: string().url('Please enter a valid URL').optional(),
});

export type DocumentFormValues = InferType<typeof documentSchema>;
