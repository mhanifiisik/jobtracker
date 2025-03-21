import supabase from '@/utils/supabase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const fetchData = async <T>(table: string): Promise<T[]> => {
  const { data, error } = await supabase.from(table).select('*')
  if (error) throw new Error(error.message)
  return data as T[]
}

export const useFetchData = <T>(table: string, key?: string) => {
  return useQuery({
    queryKey: [key ?? table],
    queryFn: () => fetchData<T>(table)
  })
}

type MutationType = 'insert' | 'update' | 'delete'

const mutateData = async <T>(
  table: string,
  type: MutationType,
  payload: Partial<T>,
  matchId?: number
) => {
  let response
  if (type === 'insert') {
    response = await supabase.from(table).insert([payload])
  } else if (type === 'update') {
    response = await supabase.from(table).update(payload).eq('id', matchId)
  } else {
    response = await supabase.from(table).delete().eq('id', matchId)
  }

  if (response.error) throw new Error(response.error.message)
  return response.data
}

export const useMutateData = <T>(table: string, type: MutationType) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<T> & { id?: number }) =>
      mutateData<T>(table, type, payload, payload.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [table] })
    }
  })
}
