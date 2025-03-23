import type { TableNames, Tables } from '@/types/db-tables';
import { handleError } from '@/utils/error-handler';
import supabase from '@/utils/supabase';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import type { QueryOptions } from '@/types/query-options';

export type TableData<T extends TableNames> = Tables[T];

export const useFetchData = <T extends TableNames>(table: T, options: QueryOptions = {}) => {
  const { select = '*', range, userId, orderBy, order, limit } = options;
  const query = supabase.from(table).select(select);

  if (userId && (table === 'job_applications' || table === 'documents')) {
    query.eq('user_id', userId).order('created_at', { ascending: false });
  }

  if (range) {
    query.range(range.from, range.to);
  }

  if (orderBy) {
    query.order(orderBy, { ascending: order === 'asc' });
  }

  if (limit) {
    query.limit(limit);
  }

  const { data, isLoading, error } = useQuery(query);

  if (error) {
    handleError(error);
  }

  return { data, isLoading, error } as {
    data: TableData<T>[] | null;
    isLoading: boolean;
  };
};
