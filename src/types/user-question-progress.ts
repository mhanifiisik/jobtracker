export interface UserQuestionProgress {
  user_id: string;
  question_id: number;
  status: 'SOLVED' | 'ATTEMPTED' | 'NOT_STARTED';
  times_solved: number;
  last_solved_at: string;
  created_at: string;
  updated_at: string;
}
