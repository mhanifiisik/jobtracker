import { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface StatusFormProps<T extends string> {
  id: string;
  initialStatus?: T;
  options: Option[];
  className?: string;
  onStatusChange: (id: string, value: T) => Promise<void> | void;
}

export function StatusForm<T extends string>({
  id,
  initialStatus,
  options,
  className = 'w-full rounded-md border p-2',
  onStatusChange
}: StatusFormProps<T>) {
  const [status, setStatus] = useState<T>((initialStatus ?? options[0]?.value) as T);

  const handleStatusChange = async (newStatus: T) => {
    try {
      setStatus(newStatus);

      await onStatusChange(id, newStatus);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <select
      id={id}
      className={className}
      value={status}
      onChange={(e) => handleStatusChange(e.target.value as T)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

