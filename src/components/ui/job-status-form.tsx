import { useState } from 'react';
import { type Tables } from '@/types/db-tables';
import { useMutateData } from '@/hooks/use-mutate-data';
import { MutationType } from '@/constants/mutation-type.enum';


interface JobStatusFormProps {
  jobId: string;
}

export function JobStatusForm({ jobId }: JobStatusFormProps) {
  const [status, setStatus] = useState<Tables['jobs']['Row']['status']>('new');

  const { mutateAsync: update } = useMutateData('jobs', MutationType.UPDATE);



  const handleStatusChange = async (newStatus: Tables['jobs']['Row']['status']) => {
    try {
      setStatus(newStatus);
      await update({ id: jobId, status: newStatus });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <select
      id={jobId}
      className="w-full rounded-md border p-2"
      value={status ?? 'new'}
      onChange={e => handleStatusChange(e.target.value as Tables['jobs']['Row']['status'])}
    >
      <option value="new">New</option>
      <option value="applied">Applied</option>
      <option value="in interview">In Interview</option>
      <option value="on wishlist">On Wishlist</option>
      <option value="rejected">Rejected</option>
      <option value="ready for review">Ready for Review</option>
    </select>
  );
}
