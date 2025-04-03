import type { Job } from '@/types/db-tables';
import supabase from '@/utils/supabase';
import { create } from 'zustand';
import { useAuthStore } from './auth';
import type { TablesUpdate } from '@/types/database';
import type { TablesInsert } from '@/types/database';
import { useErrorStore } from './error-handler';
import toast from 'react-hot-toast';
interface JobsState {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  createJob: (job: TablesInsert<'jobs'>) => Promise<void>;
  updateJob: (id: number, job: TablesUpdate<'jobs'>) => Promise<void>;
  deleteJob: (id: number) => Promise<void>;
}

export const useJobsStore = create<JobsState>(set => ({
  jobs: [],
  isLoading: false,
  error: null,
  fetchJobs: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase.from('jobs').select('*').eq('user_id', user.id);
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set({ isLoading: false, jobs: data });
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to fetch jobs'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch jobs',
      });
    }
  },
  createJob: async (job: TablesInsert<'jobs'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const jobWithUserId = { ...job, user_id: user.id };
      const { data, error } = await supabase.from('jobs').insert(jobWithUserId).select();
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          jobs: [...state.jobs, ...data],
        }));
        toast.success('Job created successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to create job'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create job',
      });
    }
  },
  updateJob: async (id: number, job: TablesUpdate<'jobs'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase
        .from('jobs')
        .update(job)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          jobs: state.jobs.map(j => (j.id === id ? data[0] : j)),
        }));
        toast.success('Job updated successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to update job'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update job',
      });
    }
  },
  deleteJob: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { error } = await supabase.from('jobs').delete().eq('id', id).eq('user_id', user.id);
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          jobs: state.jobs.filter(job => job.id !== id),
        }));
        toast.success('Job deleted successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to delete job'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete job',
      });
    }
  },
}));
