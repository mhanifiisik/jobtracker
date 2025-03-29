import { LogOut, User } from 'lucide-react';
import { useSession } from '@/hooks/use-session';
import supabase from '@/utils/supabase';
import { handleError } from '@/utils/error-handler';
import Dropdown from './ui/dropdown';

interface UserDropdownProps {
  collapsed?: boolean;
}

export default function UserDropdown({ collapsed }: UserDropdownProps) {
  const { session } = useSession();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      handleError(error);
    }
  };

  const truncateEmail = (email: string) => {
    if (email.length > 20) {
      const [username, domain] = email.split('@');
      return `${username.slice(0, 10)}...@${domain}`;
    }
    return email;
  };

  const trigger = (
    <div className="flex items-center gap-2">
      <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
        <User className="h-4 w-4" />
      </div>
      {!collapsed && (
        <span className="max-w-[150px] truncate text-sm">
          {session?.user.email && truncateEmail(session.user.email)}
        </span>
      )}
    </div>
  );

  return (
    <Dropdown trigger={trigger}>
      <button
        type="button"
        onClick={handleSignOut}
        className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </Dropdown>
  );
}
