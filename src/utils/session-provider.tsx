import { useAuthStore } from '@/store/auth';
import { useEffect } from 'react';
import supabase from './supabase';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const refreshSession = useAuthStore(state => state.refreshSession);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);

  useEffect(() => {
    void refreshSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.setState({
        user: session?.user ?? null,
        session: session,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshSession]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return toast.error(error);
  }

  return <>{children}</>;
}
