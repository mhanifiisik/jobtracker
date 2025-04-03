import type { Task } from '@/types/db-tables';
import supabase from '@/utils/supabase';
import { create } from 'zustand';
import { useAuthStore } from './auth';
import type { TablesInsert, TablesUpdate } from '@/types/database';
import { useErrorStore } from './error-handler';
import toast from 'react-hot-toast';

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
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id);
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set({ isLoading: false, tasks: data });
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to fetch tasks'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
      });
    }
  },
  createTask: async (task: Omit<Task, 'id' | 'created_at'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .eq('user_id', user.id)
        .select();
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          tasks: [...state.tasks, ...data],
        }));
        toast.success('Task created successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to create task'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create task',
      });
    }
  },
  updateTask: async (id: number, task: TablesUpdate<'tasks'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
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
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          tasks: state.tasks.map(t => (t.id === id ? data[0] : t)),
        }));
        toast.success('Task updated successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to update task'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update task',
      });
    }
  },
  deleteTask: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { error } = await supabase.from('tasks').delete().eq('id', id).eq('user_id', user.id);
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          tasks: state.tasks.filter(t => t.id !== id),
        }));
        toast.success('Task deleted successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to delete task'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete task',
      });
    }
  },
}));
