import { format } from 'date-fns';

export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
};
