import type { JobApplication } from '@/types/db-tables';
import { create } from 'zustand';
import { useAuthStore } from './auth';
import supabase from '@/utils/supabase';
import type { TablesInsert, TablesUpdate } from '@/types/database';
import { useErrorStore } from './error-handler';
import toast from 'react-hot-toast';

interface ApplicationsState {
  applications: JobApplication[];
  isLoading: boolean;
  error: string | null;
  recentApplications: JobApplication[] | null;
  fetchRecentApplications: () => Promise<void>;
  fetchApplications: () => Promise<void>;
  createApplication: (application: TablesInsert<'job_applications'>) => Promise<void>;
  updateApplication: (id: number, application: TablesUpdate<'job_applications'>) => Promise<void>;
  deleteApplication: (id: number) => Promise<void>;
}

export const useApplicationsStore = create<ApplicationsState>(set => ({
  applications: [],
  isLoading: false,
  error: null,
  recentApplications: null,

  fetchApplications: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }

      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set({ isLoading: false, applications: data });
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to fetch applications'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch applications',
      });
    }
  },

  fetchRecentApplications: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }

      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set({ isLoading: false, recentApplications: data });
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(
          error instanceof Error ? error : new Error('Failed to fetch recent applications')
        );
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recent applications',
      });
    }
  },

  createApplication: async (application: TablesInsert<'job_applications'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }

      const { data, error } = await supabase.from('job_applications').insert(application).select();

      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          applications: [...state.applications, ...data],
        }));
        toast.success('Application created successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to create application'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create application',
      });
    }
  },

  updateApplication: async (id: number, application: TablesUpdate<'job_applications'>) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('job_applications')
        .update(application)
        .eq('id', id)
        .select();

      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          applications: state.applications.map(app => (app.id === id ? data[0] : app)),
        }));
        toast.success('Application updated successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to update application'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update application',
      });
    }
  },

  deleteApplication: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.from('job_applications').delete().eq('id', id);

      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          applications: state.applications.filter(app => app.id !== id),
        }));
        toast.success('Application deleted successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to delete application'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete application',
      });
    }
  },
}));
