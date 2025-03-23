import type { Application } from './application';
import type { Document } from './document';
import type { JobListing } from './job-listing';
import type { Question } from './question';
import type { QuestionCategory } from './question-category';
import type { UserQuestionProgress } from './user-question-progress';

export interface Tables {
  jobs: JobListing;
  job_applications: Application;
  documents: Document;
  questions: Question;
  user_question_progress: UserQuestionProgress;
  question_categories: QuestionCategory;
}

export type TableNames = keyof Tables;
