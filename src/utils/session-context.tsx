import { createContext } from 'react';
import type { Session } from '@supabase/supabase-js';

export const SessionContext = createContext<{ session: Session | null } | null>(null);
