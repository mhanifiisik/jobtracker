import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { ReactNode } from 'react';
import supabase from './supabase';
import { SessionContext } from './session-context';
import Loader from '@/components/ui/loading';

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: authStateListener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => {
      authStateListener.subscription.unsubscribe();
    };
  }, []);

  const memoizedValue = useMemo(() => ({ session }), [session]);

  return <SessionContext value={memoizedValue}>{isLoading ? <Loader /> : children}</SessionContext>;
};
