import { use } from 'react'
import { Session } from '@supabase/supabase-js'
import { SessionContext } from './session-context'

export const useSession = (): { session: Session | null } => {
  const context = use(SessionContext)

  if (context === null) {
    throw new Error('useSession must be used within a SessionProvider')
  }

  return context
}
