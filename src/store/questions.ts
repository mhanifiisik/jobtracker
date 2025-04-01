import type { TablesInsert, TablesUpdate } from '@/types/database';
import supabase from '@/utils/supabase';
import { create } from 'zustand';
import { useAuthStore } from './auth';
import type { Question, QuestionCategory } from '@/types/db-tables';

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
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase.from('questions').select('*').eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ isLoading: false, questions: data });
    }
  },
  createQuestion: async (question: TablesInsert<'questions'>) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('questions')
      .insert(question)
      .eq('user_id', user.id)
      .select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        questions: [...state.questions, ...data],
      }));
    }
  },
  updateQuestion: async (id: number, question: TablesUpdate<'questions'>) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
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
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        questions: state.questions.map(q => (q.id === id ? data[0] : q)),
      }));
    }
  },
  deleteQuestion: async (id: number) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { error } = await supabase.from('questions').delete().eq('id', id).eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        questions: state.questions.filter(q => q.id !== id),
      }));
    }
  },
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('question_categories')
      .select('*')
      .eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ isLoading: false, categories: data });
    }
  },
  createCategory: async (category: TablesInsert<'question_categories'>) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('question_categories')
      .insert(category)
      .eq('user_id', user.id)
      .select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        categories: [...state.categories, ...data],
      }));
    }
  },
  updateCategory: async (id: number, category: TablesUpdate<'question_categories'>) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
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
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        categories: state.categories.map(c => (c.id === id ? data[0] : c)),
      }));
    }
  },
  deleteCategory: async (id: number) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { error } = await supabase
      .from('question_categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        categories: state.categories.filter(c => c.id !== id),
      }));
    }
  },
}));
