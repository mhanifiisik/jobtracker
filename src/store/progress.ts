import type { Tables, TablesInsert, TablesUpdate } from '@/types/database';
import { create } from 'zustand';
import { useAuthStore } from './auth';
import supabase from '@/utils/supabase';

interface ProgressState {
  progress: Tables<'user_question_progress'>[];
  isLoading: boolean;
  error: string | null;
  fetchProgress: () => Promise<void>;
  createProgress: (progress: TablesInsert<'user_question_progress'>) => Promise<void>;
  updateProgress: (questionId: number, progress: TablesUpdate<'user_question_progress'>) => Promise<void>;
  deleteProgress: (questionId: number) => Promise<void>;
  resetProgress: (questionId: number) => Promise<void>;
}

export const useProgressStore = create<ProgressState>(set => ({
  progress: [],
  isLoading: false,
  error: null,
  fetchProgress: async () => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('user_question_progress')
      .select('*')
      .eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ isLoading: false, progress: data });
    }
  },
  createProgress: async (progress: TablesInsert<'user_question_progress'>) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('user_question_progress')
      .insert(progress)
      .eq('user_id', user.id)
      .select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        progress: [...state.progress, ...data],
      }));
    }
  },
  updateProgress: async (questionId: number, progress: TablesUpdate<'user_question_progress'>) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('user_question_progress')
      .update(progress)
      .eq('question_id', questionId)
      .eq('user_id', user.id)
      .select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        progress: state.progress.map(p => (p.question_id === questionId ? data[0] : p)),
      }));
    }
  },
  deleteProgress: async (questionId: number) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { error } = await supabase
      .from('user_question_progress')
      .delete()
      .eq('question_id', questionId)
      .eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        progress: state.progress.filter(p => p.question_id !== questionId),
      }));
    }
  },
  resetProgress: async (questionId: number) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('user_question_progress')
      .update({
        status: 'not started',
        times_solved: 0,
        last_solved_at: null
      })
      .eq('question_id', questionId)
      .eq('user_id', user.id)
      .select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        progress: state.progress.map(p => (p.question_id === questionId ? data[0] : p)),
      }));
    }
  },
}));
