import type { TablesInsert, TablesUpdate } from '@/types/database';
import { create } from 'zustand';
import { useAuthStore } from './auth';
import supabase from '@/utils/supabase';
import type { UpcomingInterview } from '@/types/upcoming-interviews';
import type { Interview } from '@/types/db-tables';
import { useErrorStore } from './error-handler';
import toast from 'react-hot-toast';

interface InterviewState {
  interviews: Interview[];
  upcomingInterviews: UpcomingInterview[];
  isLoading: boolean;
  error: string | null;
  fetchInterviews: () => Promise<void>;
  fetchUpcomingInterviews: () => Promise<void>;
  createInterview: (interview: TablesInsert<'interviews'>) => Promise<void>;
  updateInterview: (id: number, interview: TablesUpdate<'interviews'>) => Promise<void>;
  deleteInterview: (id: number) => Promise<void>;
}

export const useInterviewsStore = create<InterviewState>(set => ({
  interviews: [],
  upcomingInterviews: [],
  isLoading: false,
  error: null,
  fetchInterviews: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase.from('interviews').select('*').eq('user_id', user.id);
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set({ isLoading: false, interviews: data });
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to fetch interviews'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch interviews',
      });
    }
  },
  fetchUpcomingInterviews: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase
        .from('interviews')
        .select(
          `id:id (interview_id),
        interview_date,
        interview_type,
        location,
        status,
        notes,
        job_applications (
          company_name,
          position_title,
          location:location (application_location),
          date_applied
        )`
        )
        .eq('user_id', user.id)
        .gt('interview_date', 'now()')
        .order('interview_date', { ascending: true });
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set({ isLoading: false, upcomingInterviews: data as unknown as UpcomingInterview[] });
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(
          error instanceof Error ? error : new Error('Failed to fetch upcoming interviews')
        );
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch upcoming interviews',
      });
    }
  },

  createInterview: async (interview: TablesInsert<'interviews'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase
        .from('interviews')
        .insert(interview)
        .eq('user_id', user.id)
        .select();
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          interviews: [...state.interviews, ...data],
        }));
        toast.success('Interview created successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to create interview'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create interview',
      });
    }
  },
  updateInterview: async (id: number, interview: TablesUpdate<'interviews'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase
        .from('interviews')
        .update(interview)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        toast.success('Interview updated successfully');
        set(state => ({
          isLoading: false,
          interviews: state.interviews.map(interview =>
            interview.id === id ? data[0] : interview
          ),
        }));
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to update interview'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update interview',
      });
    }
  },
  deleteInterview: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        toast.success('Interview deleted successfully');
        set(state => ({
          isLoading: false,
          interviews: state.interviews.filter(interview => interview.id !== id),
        }));
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to delete interview'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete interview',
      });
    }
  },
}));
