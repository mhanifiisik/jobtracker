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
  updateProgress: (id: number, progress: TablesUpdate<'user_question_progress'>) => Promise<void>;
  deleteProgress: (id: number) => Promise<void>;
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
  updateProgress: async (id: number, progress: TablesUpdate<'user_question_progress'>) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('user_question_progress')
      .update(progress)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        progress: state.progress.map(p => (p.question_id === id ? data[0] : p)),
      }));
    }
  },
  deleteProgress: async (id: number) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { error } = await supabase
      .from('user_question_progress')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        progress: state.progress.filter(p => p.question_id !== id),
      }));
    }
  },
}));
