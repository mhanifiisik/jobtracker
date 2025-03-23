export interface QueryOptions {
  select?: string;
  range?: {
    from: number;
    to: number;
  };
  userId?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  search?: string;
  filter?: string;
  filterOperator?: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'is' | 'is_not';
}
