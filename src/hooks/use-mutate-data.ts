import { MutationType } from '@/constants/mutation-type.enum';
import type { TableNames } from '@/types/db-tables';
import type { Database } from '@/types/database';
import { handleError } from '@/utils/error-handler';
import supabase from '@/utils/supabase';
import {
  useDeleteMutation,
  useInsertMutation,
  useUpdateMutation,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query';

import type { PostgrestError } from '@supabase/supabase-js';

type Tables = Database['public']['Tables'];

type MutationReturnType<
  _T extends TableNames,
  M extends MutationType,
> = M extends MutationType.INSERT
  ? ReturnType<typeof useInsertMutation>
  : M extends MutationType.UPDATE
    ? ReturnType<typeof useUpdateMutation>
    : M extends MutationType.UPSERT
      ? ReturnType<typeof useUpsertMutation>
      : M extends MutationType.DELETE
        ? ReturnType<typeof useDeleteMutation>
        : never;

export const useMutateData = <T extends TableNames>(
  table: T,
  type: MutationType = MutationType.INSERT
): MutationReturnType<T, typeof type> => {
  const insertMutation = useInsertMutation(
    supabase.from(table),
    ['id' as keyof Tables[T]['Row']],
    '*',
    {
      onError: (error: PostgrestError) => handleError(error),
    }
  );

  const updateMutation = useUpdateMutation(
    supabase.from(table),
    ['id' as keyof Tables[T]['Row']],
    '*',
    {
      onError: (error: PostgrestError) => handleError(error),
    }
  );

  const upsertMutation = useUpsertMutation(
    supabase.from(table),
    ['id' as keyof Tables[T]['Row']],
    '*',
    {
      onError: (error: PostgrestError) => handleError(error),
    }
  );

  const deleteMutation = useDeleteMutation(
    supabase.from(table),
    ['id' as keyof Tables[T]['Row']],
    undefined,
    {
      onError: (error: PostgrestError) => handleError(error),
    }
  );

  switch (type) {
    case MutationType.INSERT:
      return insertMutation as MutationReturnType<T, typeof type>;
    case MutationType.UPDATE:
      return updateMutation as MutationReturnType<T, typeof type>;
    case MutationType.UPSERT:
      return upsertMutation as MutationReturnType<T, typeof type>;
    case MutationType.DELETE:
      return deleteMutation as MutationReturnType<T, typeof type>;
    default:
      throw new Error('Invalid mutation type');
  }
};
