import { useCallback } from 'react';
import { handleError } from '@/utils/error-handler';
import type { AppError } from '@/types/errors';

export const useErrorHandler = () => {
  const handleErrorWithHook = useCallback((error: unknown, silent = false): AppError => {
    return handleError(error, silent);
  }, []);

  return {
    handleError: handleErrorWithHook,
  };
};
