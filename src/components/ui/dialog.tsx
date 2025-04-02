import { cn } from '@/utils/cn';
export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

const Dialog = ({ className, children, open, onOpenChange, ...props}: DialogProps) => {
    if (!open) return null;

    return (
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
          className
        )}
        onClick={() => {
          onOpenChange(false);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }

export { Dialog };

export type DialogContentProps = React.HTMLAttributes<HTMLDivElement>

const DialogContent = ({ className, children, ...props}: DialogContentProps) => {
    return (
      <div
        className={cn(
          'relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg',
          className
        )}
        onClick={e => {
          e.stopPropagation();
        }}
        {...props}
      >
        {children}
      </div>
    );
  }

export { DialogContent };

export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>

const DialogHeader = ({ className, ...props}: DialogHeaderProps) => {
    return (
      <div
        className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
        {...props}
      />
    );
  }

export { DialogHeader };

export type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>

const DialogTitle = ({ className, ...props}: DialogTitleProps) => {
    return (
      <h2
        className={cn('text-lg font-semibold leading-none tracking-tight', className)}
        {...props}
      />
    );
  }

export { DialogTitle };