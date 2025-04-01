import type { Tables } from './database';

export type Question = Tables<'questions'>;
export type Interview = Tables<'interviews'>;
export type Document = Tables<'documents'>;
export type Job = Tables<'jobs'>;
export type JobApplication = Tables<'job_applications'>;
export type Task = Tables<'tasks'>;
export type QuestionCategory = Tables<'question_categories'>;
