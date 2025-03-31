import type { TableInsert, TableRow, TableUpdate } from '@/types/db-tables';
import supabase from '@/utils/supabase';
import { create } from 'zustand';
import { useAuthStore } from './auth';

interface JobsState {
  jobs: TableRow<'jobs'>[];
  isLoading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  createJob: (job: TableInsert<'jobs'>) => Promise<void>;
  updateJob: (id: number, job: TableUpdate<'jobs'>) => Promise<void>;
  deleteJob: (id: number) => Promise<void>;
}

export const useJobsStore = create<JobsState>(set => ({
  jobs: [],
  isLoading: false,
  error: null,
  fetchJobs: async () => {
    set({ isLoading: true, error: null });

    const user = useAuthStore.getState().user;

    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }

    const { data, error } = await supabase.from('jobs').select('*').eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ isLoading: false, jobs: data });
    }
  },
  createJob: async (job: TableInsert<'jobs'>) => {
    set({ isLoading: true, error: null });

    const user = useAuthStore.getState().user;

    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }

    const jobWithUserId = { ...job, user_id: user.id };

    const { data, error } = await supabase.from('jobs').insert(jobWithUserId).select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        jobs: [...state.jobs, ...data],
      }));
    }
  },
  updateJob: async (id: number, job: TableUpdate<'jobs'>) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.from('jobs').update(job).eq('id', id).select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        jobs: state.jobs.map(j => (j.id === id ? data[0] : j)),
      }));
    }
  },
  deleteJob: async (id: number) => {
    set({ isLoading: true, error: null });
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        jobs: state.jobs.filter(job => job.id !== id),
      }));
    }
  },
}));
