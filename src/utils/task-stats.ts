import type { Task } from '@/types/database';

export function calculateTaskStats(tasks: Task[] | null) {
  const totalTasks = tasks?.length ?? 0;
  const completedTasks = tasks?.filter(task => task.status === 'completed').length ?? 0;
  const pendingTasks = tasks?.filter(task => task.status === 'pending').length ?? 0;

  return { totalTasks, completedTasks, pendingTasks };
}
