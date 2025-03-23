import type { ErrorType } from '@/constants/error-type.enum';

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  code?: string;
}
