import type { QuestionDifficulty } from '@/constants/question-difficulty.enum';

export interface Question {
  id: number;
  title: string;
  difficulty: QuestionDifficulty;
  category_id?: number;
  category_name?: string;
  url?: string;
  notes?: string;
  user_id: string;
  created_at: string;
}
