import { string, ref, date, object, array, number, type InferType } from 'yup';
import {
  LEETCODE_LANGUAGES,
  CONFIDENCE_LEVELS,
  SORT_OPTIONS,
  SORT_DIRECTIONS,
  MOOD_OPTIONS,
} from '@/constants/leetcode-constants';

export const leetcodeQuestionSchema = object({
  title: string().required('Question title is required'),
  difficulty: string()
    .oneOf(['easy', 'medium', 'hard'] as const, 'Please select a valid difficulty level')
    .required('Difficulty level is required'),
  category_id: number().nullable().optional(),
  url: string()
    .url('Please enter a valid URL')
    .matches(/^https:\/\/(leetcode\.com|www\.leetcode\.com)/, 'Please enter a valid LeetCode URL')
    .optional(),
  notes: string().optional(),
  solution: string().optional(),
});

export const leetcodeCategorySchema = object({
  name: string().required('Category name is required'),
  user_id: string().required('User ID is required'),
  description: string().optional(),
});

export const leetcodeProgressSchema = object({
  user_id: string().required('User ID is required'),
  question_id: number().required('Question ID is required'),
  status: string()
    .oneOf(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const, 'Please select a valid status')
    .required('Status is required'),
  times_solved: number()
    .min(0, 'Times solved cannot be negative')
    .integer('Times solved must be a whole number')
    .default(0),
  last_solved_at: date().nullable().default(null),
  time_spent_seconds: number()
    .min(0, 'Time spent cannot be negative')
    .integer('Time spent must be a whole number')
    .optional(),
  solution_language: string()
    .oneOf(LEETCODE_LANGUAGES, 'Please select a valid programming language')
    .optional(),
  confidence_level: number()
    .oneOf(Object.values(CONFIDENCE_LEVELS), 'Confidence level must be between 1 and 5')
    .optional(),
});

export const leetcodeStudyPlanSchema = object({
  user_id: string().required('User ID is required'),
  title: string().required('Study plan title is required'),
  description: string().optional(),
  start_date: date().nullable().optional(),
  end_date: date()
    .nullable()
    .min(ref('start_date'), 'End date cannot be earlier than start date')
    .optional(),
  goal_questions_per_day: number()
    .min(1, 'Goal must be at least 1 question per day')
    .integer('Goal must be a whole number')
    .optional(),
  categories: array().of(number()).optional(),
  question_ids: array().of(number()).optional(),
});

export const leetcodeStudySessionSchema = object({
  user_id: string().required('User ID is required'),
  study_plan_id: number().nullable().optional(),
  start_time: date().required('Start time is required'),
  end_time: date()
    .min(ref('start_time'), 'End time cannot be earlier than start time')
    .nullable()
    .optional(),
  questions_solved: number()
    .min(0, 'Questions solved cannot be negative')
    .integer('Questions solved must be a whole number')
    .default(0),
  notes: string().optional(),
  mood: string().oneOf(MOOD_OPTIONS, 'Please select a valid mood').optional(),
});

export const leetcodeFilterSchema = object({
  difficulty: string()
    .oneOf(['easy', 'medium', 'hard', 'all'] as const, 'Invalid difficulty filter')
    .optional(),
  category_id: number().nullable().optional(),
  status: string()
    .oneOf(['todo', 'in_progress', 'completed'] as const, 'Invalid status filter')
    .optional(),
  searchQuery: string().optional(),
  sortBy: string().oneOf(Object.values(SORT_OPTIONS), 'Invalid sort option').optional(),
  sortDirection: string()
    .oneOf(Object.values(SORT_DIRECTIONS), 'Invalid sort direction')
    .optional(),
});

export const validationSchema = object({
  title: string().required('Title is required'),
  difficulty: string().required('Difficulty is required'),
  category_id: number().nullable().optional(),
  url: string().url('Please enter a valid URL').optional(),
  notes: string().optional(),
});

export type LeetcodeQuestionFormValues = InferType<typeof leetcodeQuestionSchema>;
export type LeetcodeCategoryFormValues = InferType<typeof leetcodeCategorySchema>;
export type LeetcodeProgressFormValues = InferType<typeof leetcodeProgressSchema>;
export type LeetcodeStudyPlanFormValues = InferType<typeof leetcodeStudyPlanSchema>;
export type LeetcodeStudySessionFormValues = InferType<typeof leetcodeStudySessionSchema>;
export type LeetcodeFilterValues = InferType<typeof leetcodeFilterSchema>;
export type ValidationValues = InferType<typeof validationSchema>;
