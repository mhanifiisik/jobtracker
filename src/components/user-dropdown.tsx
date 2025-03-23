import { LogOut } from 'lucide-react';
import { useSession } from '@/hooks/use-session';
import { useState, useRef, useEffect } from 'react';
import supabase from '@/utils/supabase';
import { handleError } from '@/utils/error-handler';

interface UserDropdownProps {
  collapsed?: boolean;
}

export default function UserDropdown({ collapsed = false }: UserDropdownProps) {
  const { session } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      handleError(error as Error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="flex items-center justify-center gap-2"
      >
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <img
            src={session?.user.user_metadata.picture as string}
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {session?.user.email && session.user.email.length > 20
                ? session.user.email.slice(0, 20) + '...'
                : session?.user.email}
            </p>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="border-border bg-card bg-background absolute bottom-full left-5 z-50 w-48 rounded-lg border py-1 shadow-lg">
          <div className="px-3 py-2">
            <p className="text-foreground truncate text-sm font-medium">{session?.user.email}</p>
          </div>
          <div className="bg-border h-px" />
          <button
            type="button"
            onClick={() => {
              void handleLogout();
            }}
            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
