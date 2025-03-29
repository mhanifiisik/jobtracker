import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  onToggle?: (isOpen: boolean) => void;
}

export default function Dropdown({
  trigger,
  children,
  className = '',
  triggerClassName = '',
  menuClassName = '',
  onToggle,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    const newOpenState = !isOpen;
    setIsOpen(newOpenState);
    onToggle?.(newOpenState);
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onToggle?.(false);
      }
    },
    [onToggle]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div ref={dropdownRef} className={`dropdown relative inline-block text-left ${className}`}>
      <div onClick={toggleDropdown} className={`cursor-pointer ${triggerClassName}`}>
        {trigger}
      </div>

      <div
        className={`bg-card text-card-foreground border-border absolute z-50 min-w-[200px] rounded-md border shadow-lg transition-all duration-200 ${
          isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        } bottom-full mb-2 ${menuClassName}`}
        role="menu"
      >
        {children}
      </div>
    </div>
  );
}
