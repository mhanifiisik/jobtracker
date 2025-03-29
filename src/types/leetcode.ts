import type { Database } from './database';

export type Question = Database['public']['Tables']['questions']['Row'] & {
  user_question_progress?: Database['public']['Tables']['user_question_progress']['Row'];
  category_name?: string;
};

export type QuestionCategory = Database['public']['Tables']['question_categories']['Row'];

export type QuestionDifficulty = Database['public']['Enums']['difficulty_enum'];
export type QuestionStatus = Database['public']['Enums']['user_question_progress_status_enum'];
