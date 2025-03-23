import { MutationType } from '@/constants/mutation-type.enum';
import type { TableNames } from '@/types/db-tables';
import { handleError } from '@/utils/error-handler';
import supabase from '@/utils/supabase';
import {
  useDeleteMutation,
  useInsertMutation,
  useUpdateMutation,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import type { PostgrestError } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const useMutateData = <T extends TableNames>(
  table: T,
  type: MutationType = MutationType.INSERT
) => {
  const insertMutation = useInsertMutation(supabase.from(table), ['id'], '*', {
    onError: (error: PostgrestError) => handleError(error),
  });

  const updateMutation = useUpdateMutation(supabase.from(table), ['id'], '*', {
    onError: (error: PostgrestError) => handleError(error),
  });

  const upsertMutation = useUpsertMutation(supabase.from(table), ['id'], '*', {
    onError: (error: PostgrestError) => handleError(error),
  });

  const deleteMutation = useDeleteMutation(supabase.from(table), ['id'], undefined, {
    onError: (error: PostgrestError) => handleError(error),
  });

  switch (type) {
    case MutationType.INSERT:
      return insertMutation;
    case MutationType.UPDATE:
      return updateMutation;
    case MutationType.UPSERT:
      return upsertMutation;
    case MutationType.DELETE:
      return deleteMutation;
    default:
      throw new Error('Invalid mutation type');
  }
};
