import type { Task } from '@/types/db-tables';
import supabase from '@/utils/supabase';
import { create } from 'zustand';
import { useAuthStore } from './auth';
import type { TablesInsert, TablesUpdate } from '@/types/database';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (task: TablesInsert<'tasks'>) => Promise<void>;
  updateTask: (id: number, task: TablesUpdate<'tasks'>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

export const useTasksStore = create<TasksState>(set => ({
  tasks: [],
  isLoading: false,
  error: null,
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ isLoading: false, tasks: data });
    }
  },
  createTask: async (task: Omit<Task, 'id' | 'created_at'>) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .eq('user_id', user.id)
      .select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        tasks: [...state.tasks, ...data],
      }));
    }
  },
  updateTask: async (id: number, task: TablesUpdate<'tasks'>) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('tasks')
      .update(task)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        tasks: state.tasks.map(t => (t.id === id ? data[0] : t)),
      }));
    }
  },
  deleteTask: async (id: number) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { error } = await supabase.from('tasks').delete().eq('id', id).eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        tasks: state.tasks.filter(t => t.id !== id),
      }));
    }
  },
}));
