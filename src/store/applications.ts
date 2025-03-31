import type { TableInsert, TableRow, TableUpdate } from '@/types/db-tables';
import { create } from 'zustand';
import { useAuthStore } from './auth';
import supabase from '@/utils/supabase';

interface ApplicationsState {
  applications: TableRow<'job_applications'>[];
  isLoading: boolean;
  error: string | null;
  recentApplications: TableRow<'job_applications'>[] | null;
  fetchRecentApplications: () => Promise<void>;
  fetchApplications: () => Promise<void>;
  createApplication: (application: TableInsert<'job_applications'>) => Promise<void>;
  updateApplication: (id: number, application: TableUpdate<'job_applications'>) => Promise<void>;
  deleteApplication: (id: number) => Promise<void>;
}

export const useApplicationsStore = create<ApplicationsState>(set => ({
  applications: [],
  isLoading: false,
  error: null,
  recentApplications: null,
  fetchApplications: async () => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ isLoading: false, applications: data });
    }
  },
  fetchRecentApplications: async () => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
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
      set({ isLoading: false, error: error.message });
    } else {
      set({ isLoading: false, recentApplications: data });
    }
  },

  createApplication: async (application: TableInsert<'job_applications'>) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase.from('job_applications').insert(application).select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        applications: [...state.applications, ...data],
      }));
    }
  },
  updateApplication: async (id: number, application: TableUpdate<'job_applications'>) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase
      .from('job_applications')
      .update(application)
      .eq('id', id)
      .select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        applications: state.applications.map(app => (app.id === id ? data[0] : app)),
      }));
    }
  },
  deleteApplication: async (id: number) => {
    set({ isLoading: true, error: null });
    const { error } = await supabase.from('job_applications').delete().eq('id', id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        applications: state.applications.filter(app => app.id !== id),
      }));
    }
  },
}));
