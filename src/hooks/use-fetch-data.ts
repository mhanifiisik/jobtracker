import type { Database } from '@/types/database';
import { handleError } from '@/utils/error-handler';
import supabase from '@/utils/supabase';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';

type TableNames = keyof Database['public']['Tables'];
type TableRow<T extends TableNames> = Database['public']['Tables'][T]['Row'];

type FilterCondition<T extends TableNames> = {
  [K in keyof TableRow<T>]: {
    column: K;
    value: TableRow<T>[K];
    operator?: 'gt' | 'lt' | 'eq' | 'neq';
  };
}[keyof TableRow<T>];

export interface QueryOptions<T extends TableNames> {
  select?: string;
  range?: { from: number; to: number };
  userId?: string;
  orderBy?: keyof TableRow<T>;
  order?: 'asc' | 'desc';
  limit?: number;
  filters?: FilterCondition<T>[];
  offset?: number;
}

export const useFetchData = <T extends TableNames>(table: T, options: QueryOptions<T> = {}) => {
  const { select = '*', range, userId, orderBy, order = 'desc', limit, filters, offset } = options;

  const query = supabase.from(table).select(select);

  if (userId) {
    try {
      // Type assertion here is necessary because TypeScript doesn't know which tables have user_id
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query.eq('user_id' as any, userId);
    } catch {
      console.warn(`Table ${table} does not have a user_id column`);
    }
  }

  if (filters) {
    filters.forEach(filter => {
      const { column, value, operator = 'eq' } = filter as any;
      switch (operator) {
        case 'eq':
          query.eq(column, value);
          break;
        case 'gt':
          query.gt(column, value);
          break;
        case 'lt':
          query.lt(column, value);
          break;
        case 'neq':
          query.neq(column, value);
          break;
        default:
          query.eq(column, value);
          break;
      }
    });
  }
  if (range) {
    query.range(range.from, range.to);
  }

  if (orderBy) {
    // Type assertion here is necessary because the column can vary based on table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query.order(String(orderBy) as any, { ascending: order === 'asc' });
  }

  if (limit) {
    query.limit(limit);
  }

  if (offset && limit) {
    query.range(offset, offset + limit);
  }

  const { data, isLoading, error } = useQuery(query);

  if (error) {
    handleError(error);
  }

  return {
    data: data as TableRow<T>[] | null,
    isLoading,
    error,
  };
};
