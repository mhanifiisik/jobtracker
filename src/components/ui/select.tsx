import { cn } from '@/utils/cn';
import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
  ref?: React.Ref<HTMLSelectElement>;
}

const Select = ({
  className,
  children,
  onValueChange,
  ref,
  ...props
}: SelectProps) => {
  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onChange={e => onValueChange?.(e.target.value)}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
};

Select.displayName = 'Select';
export { Select };

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  placeholder?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

const SelectTrigger = ({
  className,
  children,
  ref,
  ...props
}: SelectTriggerProps) => {
  return (
    <button
      type="button"
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
};

SelectTrigger.displayName = 'SelectTrigger';
export { SelectTrigger };

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

const SelectContent = ({
  className,
  children,
  ref,
  ...props
}: SelectContentProps) => {
  return (
    <div
      className={cn(
        'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
};

SelectContent.displayName = 'SelectContent';
export { SelectContent };

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  ref?: React.Ref<HTMLDivElement>;
}

const SelectItem = ({
  className,
  children,
  ref,
  ...props
}: SelectItemProps) => {
  return (
    <div
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <span className="h-2 w-2 rounded-full bg-current" />
      </span>
      {children}
    </div>
  );
};

SelectItem.displayName = 'SelectItem';
export { SelectItem };

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
  ref?: React.Ref<HTMLSpanElement>;
}

const SelectValue = ({
  className,
  children,
  placeholder,
  ref,
  ...props
}: SelectValueProps) => {
  return (
    <span
      className={cn('block truncate', className)}
      ref={ref}
      {...props}
    >
      {children ?? placeholder}
    </span>
  );
};

SelectValue.displayName = 'SelectValue';
export { SelectValue };