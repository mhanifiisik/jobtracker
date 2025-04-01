import type { TablesInsert, TablesUpdate } from '@/types/database';
import { create } from 'zustand';
import { useAuthStore } from './auth';
import supabase from '@/utils/supabase';
import type { UpcomingInterview } from '@/types/upcoming-interviews';
import type { Interview } from '@/types/db-tables';

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
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase.from('interviews').select('*').eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ isLoading: false, interviews: data });
    }
  },
  fetchUpcomingInterviews: async () => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
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
      set({ isLoading: false, error: error.message });
    } else {
      set({ isLoading: false, upcomingInterviews: data as unknown as UpcomingInterview[] });
    }
  },

  createInterview: async (interview: TablesInsert<'interviews'>) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('interviews')
      .insert(interview)
      .eq('user_id', user.id)
      .select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        interviews: [...state.interviews, ...data],
      }));
    }
  },
  updateInterview: async (id: number, interview: TablesUpdate<'interviews'>) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
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
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        interviews: state.interviews.map(interview => (interview.id === id ? data[0] : interview)),
      }));
    }
  },
  deleteInterview: async (id: number) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { error } = await supabase
      .from('interviews')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        interviews: state.interviews.filter(interview => interview.id !== id),
      }));
    }
  },
}));
