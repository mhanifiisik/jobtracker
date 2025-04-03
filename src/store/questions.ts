import type { TablesInsert, TablesUpdate } from '@/types/database';
import supabase from '@/utils/supabase';
import { create } from 'zustand';
import { useAuthStore } from './auth';
import type { QuestionCategory } from '@/types/db-tables';
import type { Question } from '@/types/db-tables';
import { useErrorStore } from './error-handler';
import toast from 'react-hot-toast';

interface QuestionsState {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  categories: QuestionCategory[];
  fetchQuestions: () => Promise<void>;
  createQuestion: (question: TablesInsert<'questions'>) => Promise<void>;
  updateQuestion: (id: number, question: TablesUpdate<'questions'>) => Promise<void>;
  deleteQuestion: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createCategory: (category: TablesInsert<'question_categories'>) => Promise<void>;
  updateCategory: (id: number, category: TablesUpdate<'question_categories'>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useQuestionsStore = create<QuestionsState>(set => ({
  questions: [],
  isLoading: false,
  error: null,
  categories: [],
  fetchQuestions: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase.from('questions').select('*').eq('user_id', user.id);
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set({ isLoading: false, questions: data });
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to fetch questions'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch questions',
      });
    }
  },
  createQuestion: async (question: TablesInsert<'questions'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase
        .from('questions')
        .insert(question)
        .eq('user_id', user.id)
        .select();
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          questions: [...state.questions, ...data],
        }));
        toast.success('Question created successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to create question'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create question',
      });
    }
  },
  updateQuestion: async (id: number, question: TablesUpdate<'questions'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase
        .from('questions')
        .update(question)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          questions: state.questions.map(q => (q.id === id ? data[0] : q)),
        }));
        toast.success('Question updated successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to update question'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update question',
      });
    }
  },
  deleteQuestion: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          questions: state.questions.filter(q => q.id !== id),
        }));
        toast.success('Question deleted successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to delete question'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete question',
      });
    }
  },
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase
        .from('question_categories')
        .select('*')
        .eq('user_id', user.id);
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set({ isLoading: false, categories: data });
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to fetch categories'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      });
    }
  },
  createCategory: async (category: TablesInsert<'question_categories'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase
        .from('question_categories')
        .insert(category)
        .eq('user_id', user.id)
        .select();
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          categories: [...state.categories, ...data],
        }));
        toast.success('Category created successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to create category'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create category',
      });
    }
  },
  updateCategory: async (id: number, category: TablesUpdate<'question_categories'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase
        .from('question_categories')
        .update(category)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          categories: state.categories.map(c => (c.id === id ? data[0] : c)),
        }));
        toast.success('Category updated successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to update category'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update category',
      });
    }
  },
  deleteCategory: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { error } = await supabase
        .from('question_categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          categories: state.categories.filter(c => c.id !== id),
        }));
        toast.success('Category deleted successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to delete category'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete category',
      });
    }
  },
}));
