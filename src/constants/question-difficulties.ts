export const QUESTION_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export type QuestionDifficulty = (typeof QUESTION_DIFFICULTIES)[keyof typeof QUESTION_DIFFICULTIES];
