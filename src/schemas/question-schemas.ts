import * as yup from 'yup';

export const questionSchema = yup.object({
  title: yup.string().required('Question title is required'),
  difficulty: yup
    .string()
    .oneOf(['easy', 'medium', 'hard'] as const, 'Please select a valid difficulty level')
    .required('Difficulty level is required'),
  category_id: yup.number().nullable().optional(),
  url: yup.string().url('Please enter a valid URL').optional(),
  notes: yup.string().optional(),
});

export const questionCategorySchema = yup.object({
  name: yup.string().required('Category name is required'),
  user_id: yup.string().required('User ID is required'),
});

export const questionProgressSchema = yup.object({
  user_id: yup.string().required('User ID is required'),
  question_id: yup.number().required('Question ID is required'),
  status: yup
    .string()
    .oneOf(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const, 'Please select a valid status')
    .required('Status is required'),
  times_solved: yup.number().min(0, 'Times solved cannot be negative').optional(),
  last_solved_at: yup.date().optional(),
});

export type QuestionFormValues = yup.InferType<typeof questionSchema>;
export type QuestionCategoryFormValues = yup.InferType<typeof questionCategorySchema>;
export type QuestionProgressFormValues = yup.InferType<typeof questionProgressSchema>;
