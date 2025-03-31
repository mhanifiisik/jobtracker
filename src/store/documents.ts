import type { TableInsert, TableRow, TableUpdate } from '@/types/db-tables';
import { create } from 'zustand';
import { useAuthStore } from './auth';
import supabase from '@/utils/supabase';

interface DocumentsState {
  documents: TableRow<'documents'>[];
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  createDocument: (document: TableInsert<'documents'>) => Promise<void>;
  updateDocument: (id: number, document: TableUpdate<'documents'>) => Promise<void>;
  deleteDocument: (id: number) => Promise<void>;
}

export const useDocumentsStore = create<DocumentsState>(set => ({
  documents: [],
  isLoading: false,
  error: null,
  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase.from('documents').select('*').eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ isLoading: false, documents: data });
    }
  },
  createDocument: async (document: TableInsert<'documents'>) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('documents')
      .insert(document)
      .eq('user_id', user.id)
      .select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        documents: [...state.documents, ...data],
      }));
    }
  },
  updateDocument: async (id: number, document: TableUpdate<'documents'>) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('documents')
      .update(document)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        documents: state.documents.map(doc => (doc.id === id ? data[0] : doc)),
      }));
    }
  },
  deleteDocument: async (id: number) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not authenticated' });
      return;
    }
    const { error } = await supabase.from('documents').delete().eq('id', id).eq('user_id', user.id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set(state => ({
        isLoading: false,
        documents: state.documents.filter(doc => doc.id !== id),
      }));
    }
  },
}));
