import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Session, User } from '@supabase/supabase-js';
import supabase from '@/utils/supabase';
import { useErrorStore } from './error-handler';
import toast from 'react-hot-toast';
interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;

  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;

  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      session: null,
      isLoading: false,
      error: null,

      signUp: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) {
            useErrorStore.getState().showError(error);
            set({
              error: error instanceof Error ? error.message : 'An error occurred during sign up',
              isLoading: false,
            });
            return;
          }

          set({
            user: data.user,
            session: data.session,
            isLoading: false,
          });
          toast.success('Account created successfully!');
        } catch (error) {
          useErrorStore
            .getState()
            .showError(
              error instanceof Error ? error : new Error('An error occurred during sign up')
            );
          set({
            error: error instanceof Error ? error.message : 'An error occurred during sign up',
            isLoading: false,
          });
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            useErrorStore.getState().showError(error);
            set({
              error: error instanceof Error ? error.message : 'An error occurred during sign in',
              isLoading: false,
            });
            return;
          }

          set({
            user: data.user,
            session: data.session,
            isLoading: false,
          });
          toast.success('Signed in successfully!');
        } catch (error) {
          useErrorStore
            .getState()
            .showError(
              error instanceof Error ? error : new Error('An error occurred during sign in')
            );
          set({
            error: error instanceof Error ? error.message : 'An error occurred during sign in',
            isLoading: false,
          });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signOut();

          if (error) {
            useErrorStore.getState().showError(error);
            set({
              error: error instanceof Error ? error.message : 'An error occurred during sign out',
              isLoading: false,
            });
            return;
          }

          set({
            user: null,
            session: null,
            isLoading: false,
          });
          toast.success('Signed out successfully!');
        } catch (error) {
          useErrorStore
            .getState()
            .showError(
              error instanceof Error ? error : new Error('An error occurred during sign out')
            );
          set({
            error: error instanceof Error ? error.message : 'An error occurred during sign out',
            isLoading: false,
          });
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${import.meta.env.VITE_BASE_URL}/reset-password`,
          });

          if (error) {
            useErrorStore.getState().showError(error);
            set({
              error: error instanceof Error ? error.message : 'Failed to send reset password email',
              isLoading: false,
            });
            return;
          }

          set({ isLoading: false });
          toast.success('Password reset email sent!');
        } catch (error) {
          useErrorStore
            .getState()
            .showError(
              error instanceof Error ? error : new Error('Failed to send reset password email')
            );
          set({
            error: error instanceof Error ? error.message : 'Failed to send reset password email',
            isLoading: false,
          });
        }
      },

      signInWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/dashboard`,
            },
          });

          if (error) {
            useErrorStore.getState().showError(error);
            set({
              error: error instanceof Error ? error.message : 'Failed to sign in with Google',
              isLoading: false,
            });
            return;
          }

          set({ isLoading: false });
        } catch (error) {
          useErrorStore
            .getState()
            .showError(error instanceof Error ? error : new Error('Failed to sign in with Google'));
          set({
            error: error instanceof Error ? error.message : 'Failed to sign in with Google',
            isLoading: false,
          });
        }
      },

      signInWithGithub: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
              redirectTo: `${import.meta.env.VITE_BASE_URL}/dashboard`,
            },
          });

          if (error) {
            useErrorStore.getState().showError(error);
            set({
              error: error instanceof Error ? error.message : 'Failed to sign in with Github',
              isLoading: false,
            });
            return;
          }

          set({ isLoading: false });
        } catch (error) {
          useErrorStore
            .getState()
            .showError(error instanceof Error ? error : new Error('Failed to sign in with Github'));
          set({
            error: error instanceof Error ? error.message : 'Failed to sign in with Github',
            isLoading: false,
          });
        }
      },

      refreshSession: async () => {
        try {
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            useErrorStore.getState().showError(error);
            set({
              error: error instanceof Error ? error.message : 'Failed to refresh session',
              user: null,
              session: null,
            });
            return;
          }

          set({
            user: data.session?.user ?? null,
            session: data.session,
          });
        } catch (error) {
          useErrorStore
            .getState()
            .showError(error instanceof Error ? error : new Error('Failed to refresh session'));
          set({
            error: error instanceof Error ? error.message : 'Failed to refresh session',
            user: null,
            session: null,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        session: state.session,
      }),
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
