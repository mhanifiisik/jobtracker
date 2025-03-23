export const DOCUMENT_TYPES = {
  RESUME: 'resume',
  COVER_LETTER: 'cover_letter',
  PORTFOLIO: 'portfolio',
  RECOMMENDATION: 'recommendation',
  CERTIFICATION: 'certification',
  OTHER: 'other',
} as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];
