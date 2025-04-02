import type { Tables } from './database';

export type Interview = Tables<'interviews'>;
export type Document = Tables<'documents'>;
export type Job = Tables<'jobs'>;
export type JobApplication = Tables<'job_applications'>;
export type Task = Tables<'tasks'>;
export type Question = Tables<'questions'>;
export type QuestionCategory = Tables<'question_categories'>;
export interface QuestionProgress {
  user_id: string;
  question_id: number;
  status: 'solved' | 'attempted' | 'not started' | null;
  times_solved?: number | null;
  last_solved_at?: string | null;
  created_at: string | null;
  updated_at: string | null;
}
export type StudyPlan = Tables<'study_plan'>;
export type StudyPlanQuestion = Tables<'study_plan_questions'>;
export type StudySession = Tables<'study_session'>;
