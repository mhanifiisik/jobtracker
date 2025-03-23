import type { PostgrestError } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import type { AppError } from '@/types/errors';
import { ErrorType } from '@/types/errors';
import { ERROR_MESSAGES } from '@/constants/error-messages';

function isPostgrestError(error: unknown): error is PostgrestError {
  return error instanceof Object && 'code' in error && 'message' in error && 'details' in error;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export const handleError = (error: unknown, silent = false): AppError => {
  let appError: AppError = {
    type: ErrorType.UNKNOWN,
    message: ERROR_MESSAGES.UNKNOWN,
    originalError: isError(error) ? error : new Error(String(error)),
  };

  if (isPostgrestError(error)) {
    const postgrestError = error;
    switch (postgrestError.code) {
      case '23505':
        appError = {
          type: ErrorType.VALIDATION,
          message: ERROR_MESSAGES.VALIDATION.DUPLICATE,
          originalError: error,
          code: postgrestError.code,
        };
        break;
      case '23503':
        appError = {
          type: ErrorType.VALIDATION,
          message: ERROR_MESSAGES.VALIDATION.FOREIGN_KEY,
          originalError: error,
          code: postgrestError.code,
        };
        break;
      case '42P01':
        appError = {
          type: ErrorType.NOT_FOUND,
          message: ERROR_MESSAGES.NOT_FOUND,
          originalError: error,
          code: postgrestError.code,
        };
        break;
      case '42501':
      case '42403':
        appError = {
          type: ErrorType.AUTHORIZATION,
          message: ERROR_MESSAGES.AUTHORIZATION,
          originalError: error,
          code: postgrestError.code,
        };
        break;
      case '3D000':
      case '3F000':
        appError = {
          type: ErrorType.SERVER,
          message: ERROR_MESSAGES.SERVER,
          originalError: error,
          code: postgrestError.code,
        };
        break;
      case 'PGRST116':
        appError = {
          type: ErrorType.AUTHENTICATION,
          message: ERROR_MESSAGES.AUTHENTICATION,
          originalError: error,
          code: postgrestError.code,
        };
        break;
      default:
        appError = {
          type: ErrorType.UNKNOWN,
          message: postgrestError.message || ERROR_MESSAGES.UNKNOWN,
          originalError: error,
          code: postgrestError.code,
        };
    }
  } else if (isError(error)) {
    if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
      appError = {
        type: ErrorType.NETWORK,
        message: ERROR_MESSAGES.NETWORK,
        originalError: error,
      };
    } else {
      appError = {
        type: ErrorType.UNKNOWN,
        message: error.message || ERROR_MESSAGES.UNKNOWN,
        originalError: error,
      };
    }
  }

  if (!silent) {
    toast.error(appError.message);
  }

  return appError;
};
