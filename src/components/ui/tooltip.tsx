import * as React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip = ({ children, content, side = 'top' }: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => {
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        setIsVisible(false);
      }}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 min-w-[200px] rounded-md bg-gray-900 p-2 text-sm text-white shadow-lg ${
            side === 'top'
              ? 'bottom-full left-1/2 mb-2 -translate-x-1/2'
              : side === 'right'
                ? 'top-1/2 left-full ml-2 -translate-y-1/2'
                : side === 'bottom'
                  ? 'top-full left-1/2 mt-2 -translate-x-1/2'
                  : 'top-1/2 right-full mr-2 -translate-y-1/2'
          }`}
        >
          {content}
          <div
            className={`absolute h-2 w-2 rotate-45 bg-gray-900 ${
              side === 'top'
                ? 'bottom-[-4px] left-1/2 -translate-x-1/2'
                : side === 'right'
                  ? 'top-1/2 left-[-4px] -translate-y-1/2'
                  : side === 'bottom'
                    ? 'top-[-4px] left-1/2 -translate-x-1/2'
                    : 'top-1/2 right-[-4px] -translate-y-1/2'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
