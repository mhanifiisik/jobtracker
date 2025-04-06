import type { Tables, TablesInsert, TablesUpdate } from '@/types/database';
import { create } from 'zustand';
import { useAuthStore } from './auth';
import supabase from '@/utils/supabase';
import { useErrorStore } from './error-handler';
import toast from 'react-hot-toast';

interface ProgressState {
  progress: Tables<'user_question_progress'>[];
  isLoading: boolean;
  error: string | null;
  fetchProgress: () => Promise<void>;
  createProgress: (progress: TablesInsert<'user_question_progress'>) => Promise<void>;
  updateProgress: (
    questionId: number,
    progress: TablesUpdate<'user_question_progress'>
  ) => Promise<void>;
  deleteProgress: (questionId: number) => Promise<void>;
  resetProgress: (questionId: number) => Promise<void>;
}

export const useProgressStore = create<ProgressState>(set => ({
  progress: [],
  isLoading: false,
  error: null,
  fetchProgress: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase
        .from('user_question_progress')
        .select('*')
        .eq('user_id', user.id);
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set({ isLoading: false, progress: data });
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to fetch progress'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch progress',
      });
    }
  },
  createProgress: async (progress: TablesInsert<'user_question_progress'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase
        .from('user_question_progress')
        .insert(progress)
        .eq('user_id', user.id)
        .select();
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          progress: [...state.progress, ...data],
        }));
        toast.success('Progress created successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to create progress'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create progress',
      });
    }
  },
  updateProgress: async (questionId: number, progress: TablesUpdate<'user_question_progress'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
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
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          progress: state.progress.map(p => (p.question_id === questionId ? data[0] : p)),
        }));
        toast.success('Progress updated successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to update progress'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update progress',
      });
    }
  },
  deleteProgress: async (questionId: number) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { error } = await supabase
        .from('user_question_progress')
        .delete()
        .eq('question_id', questionId)
        .eq('user_id', user.id);
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          progress: state.progress.filter(p => p.question_id !== questionId),
        }));
        toast.success('Progress deleted successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to delete progress'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete progress',
      });
    }
  },
  resetProgress: async (questionId: number) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase
        .from('user_question_progress')
        .update({
          status: 'not started',
          times_solved: 0,
          last_solved_at: null,
        })
        .eq('question_id', questionId)
        .eq('user_id', user.id)
        .select();
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          progress: state.progress.map(p => (p.question_id === questionId ? data[0] : p)),
        }));
        toast.success('Progress reset successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to reset progress'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to reset progress',
      });
    }
  },
}));
