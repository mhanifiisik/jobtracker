import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface DropdownOption<T> {
  value: T;
  label: ReactNode;
}

interface DropdownProps<T> {
  options: DropdownOption<T>[];
  defaultValue?: DropdownOption<T>;
  onChange: (selectedOption: DropdownOption<T>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Dropdown = <T,>({
  options,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption<T> | undefined>(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: DropdownOption<T>) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            setIsOpen(prev => !prev);
          }
        }}
        className={`bg-background flex w-full items-center justify-center rounded-md border p-2 text-center shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
          disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'
        }`}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
      </button>
      {isOpen && (
        <div
          className="bg-background absolute bottom-10 z-10 max-h-60 w-full overflow-auto rounded-md border border-gray-200 shadow-lg"
          role="listbox"
        >
          <ul className="py-1 text-center">
            {options.map(option => (
              <li
                key={uuidv4()}
                onClick={() => {
                  handleOptionClick(option);
                }}
                className="flex cursor-pointer items-center justify-center border-b border-gray-200 p-2 hover:bg-gray-100"
                role="option"
                aria-selected={selectedOption?.value === option.value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
