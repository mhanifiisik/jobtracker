import * as yup from 'yup';
import {
  LEETCODE_LANGUAGES,
  CONFIDENCE_LEVELS,
  SORT_OPTIONS,
  SORT_DIRECTIONS,
  MOOD_OPTIONS,
} from '@/constants/leetcode-constants';

export const leetcodeQuestionSchema = yup.object({
  title: yup.string().required('Question title is required'),
  difficulty: yup
    .string()
    .oneOf(['easy', 'medium', 'hard'] as const, 'Please select a valid difficulty level')
    .required('Difficulty level is required'),
  category_id: yup.number().nullable().optional(),
  url: yup
    .string()
    .url('Please enter a valid URL')
    .matches(/^https:\/\/(leetcode\.com|www\.leetcode\.com)/, 'Please enter a valid LeetCode URL')
    .optional(),
  notes: yup.string().optional(),
  solution: yup.string().optional(),
});

export const leetcodeCategorySchema = yup.object({
  name: yup.string().required('Category name is required'),
  user_id: yup.string().required('User ID is required'),
  description: yup.string().optional(),
});

export const leetcodeProgressSchema = yup.object({
  user_id: yup.string().required('User ID is required'),
  question_id: yup.number().required('Question ID is required'),
  status: yup
    .string()
    .oneOf(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const, 'Please select a valid status')
    .required('Status is required'),
  times_solved: yup
    .number()
    .min(0, 'Times solved cannot be negative')
    .integer('Times solved must be a whole number')
    .default(0),
  last_solved_at: yup.date().nullable().default(null),
  time_spent_seconds: yup
    .number()
    .min(0, 'Time spent cannot be negative')
    .integer('Time spent must be a whole number')
    .optional(),
  solution_language: yup
    .string()
    .oneOf(LEETCODE_LANGUAGES, 'Please select a valid programming language')
    .optional(),
  confidence_level: yup
    .number()
    .oneOf(Object.values(CONFIDENCE_LEVELS), 'Confidence level must be between 1 and 5')
    .optional(),
});

export const leetcodeStudyPlanSchema = yup.object({
  user_id: yup.string().required('User ID is required'),
  title: yup.string().required('Study plan title is required'),
  description: yup.string().optional(),
  start_date: yup.date().nullable().optional(),
  end_date: yup
    .date()
    .nullable()
    .min(yup.ref('start_date'), 'End date cannot be earlier than start date')
    .optional(),
  goal_questions_per_day: yup
    .number()
    .min(1, 'Goal must be at least 1 question per day')
    .integer('Goal must be a whole number')
    .optional(),
  categories: yup.array().of(yup.number()).optional(),
  question_ids: yup.array().of(yup.number()).optional(),
});

export const leetcodeStudySessionSchema = yup.object({
  user_id: yup.string().required('User ID is required'),
  study_plan_id: yup.number().nullable().optional(),
  start_time: yup.date().required('Start time is required'),
  end_time: yup
    .date()
    .min(yup.ref('start_time'), 'End time cannot be earlier than start time')
    .nullable()
    .optional(),
  questions_solved: yup
    .number()
    .min(0, 'Questions solved cannot be negative')
    .integer('Questions solved must be a whole number')
    .default(0),
  notes: yup.string().optional(),
  mood: yup.string().oneOf(MOOD_OPTIONS, 'Please select a valid mood').optional(),
});

export const leetcodeFilterSchema = yup.object({
  difficulty: yup
    .string()
    .oneOf(['easy', 'medium', 'hard', 'all'] as const, 'Invalid difficulty filter')
    .optional(),
  category_id: yup.number().nullable().optional(),
  status: yup
    .string()
    .oneOf(['todo', 'in_progress', 'completed'] as const, 'Invalid status filter')
    .optional(),
  searchQuery: yup.string().optional(),
  sortBy: yup.string().oneOf(Object.values(SORT_OPTIONS), 'Invalid sort option').optional(),
  sortDirection: yup
    .string()
    .oneOf(Object.values(SORT_DIRECTIONS), 'Invalid sort direction')
    .optional(),
});

export const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  difficulty: yup.string().required('Difficulty is required'),
  category_id: yup.number().nullable().optional(),
  url: yup.string().url('Please enter a valid URL').optional(),
  notes: yup.string().optional(),
});

export type LeetcodeQuestionFormValues = yup.InferType<typeof leetcodeQuestionSchema>;
export type LeetcodeCategoryFormValues = yup.InferType<typeof leetcodeCategorySchema>;
export type LeetcodeProgressFormValues = yup.InferType<typeof leetcodeProgressSchema>;
export type LeetcodeStudyPlanFormValues = yup.InferType<typeof leetcodeStudyPlanSchema>;
export type LeetcodeStudySessionFormValues = yup.InferType<typeof leetcodeStudySessionSchema>;
export type LeetcodeFilterValues = yup.InferType<typeof leetcodeFilterSchema>;
export type ValidationValues = yup.InferType<typeof validationSchema>;
