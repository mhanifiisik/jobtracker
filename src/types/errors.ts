import type { PostgrestError } from '@supabase/supabase-js';

// Error types enum
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  VALIDATION = 'validation',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

// App error interface
export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error | PostgrestError;
  code?: string;
}
