import type { Database } from './database';

export type Tables = Database['public']['Tables'];

export type TableNames = keyof Tables;

export type TableRow<T extends TableNames> = Tables[T]['Row'];
export type TableInsert<T extends TableNames> = Tables[T]['Insert'];
export type TableUpdate<T extends TableNames> = Tables[T]['Update'];
