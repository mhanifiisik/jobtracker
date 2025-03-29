export type MutationType = 'CREATE' | 'UPDATE' | 'DELETE';

export const MutationType = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;
