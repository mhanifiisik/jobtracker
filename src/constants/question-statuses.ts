export const QUESTION_STATUSES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  SOLVED: 'solved',
  REVISIT: 'revisit',
} as const;

export type QuestionStatus = (typeof QUESTION_STATUSES)[keyof typeof QUESTION_STATUSES];
