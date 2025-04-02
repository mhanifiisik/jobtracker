import { cn } from "@/utils/cn";
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  ref?: React.RefObject<HTMLLabelElement | null>;
}

const Label = ({ ref, className, ...props }: LabelProps & { ref?: React.RefObject<HTMLLabelElement | null> }) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      />
    );
  };
Label.displayName = 'Label';

export { Label };