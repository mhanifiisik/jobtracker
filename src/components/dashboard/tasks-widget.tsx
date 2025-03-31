import { useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTasksStore } from '@/store/tasks';
import type { TableRow } from '@/types/db-tables';

interface GroupedTasks {
  pending: TableRow<'tasks'>[];
  inProgress: TableRow<'tasks'>[];
  completed: TableRow<'tasks'>[];
}

export default function TasksWidget() {

  const { tasks } = useTasksStore();

  const groupedTasks = useMemo(() => {

    return {
      pending: tasks.filter(t => t.status === 'pending'),
      inProgress: tasks.filter(t => t.status === 'in progress'),
      completed: tasks.filter(t => t.status === 'completed'),
    } as GroupedTasks;
  }, [tasks]);

  return (
    <div className="border-border overflow-hidden rounded-lg border bg-card">
      <div className="border-border flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-medium text-foreground">Tasks</h3>
        <button
          type="button"
          className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {groupedTasks.pending.length > 0 && (
            <div>
                <h4 className="text-muted-foreground mb-2 text-sm font-medium">Pending</h4>
                <div className="space-y-2">
                  {groupedTasks.pending.map(task => (
                    <div key={task.id} className="flex items-center gap-2">
                      <input type="checkbox" id={`task-${task.id}`} className="accent-primary" />
                      <label
                        htmlFor={`task-${task.id}`}
                        className="text-sm leading-none font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {task.task_name}
                      </label>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groupedTasks.inProgress.length > 0 && (
              <div>
                <h4 className="text-muted-foreground mb-2 text-sm font-medium">In Progress</h4>
                <div className="space-y-2">
                  {groupedTasks.inProgress.map(task => (
                    <div key={task.id} className="flex items-center gap-2">
                      <input type="checkbox" id={`task-${task.id}`} className="accent-primary" />
                      <label
                        htmlFor={`task-${task.id}`}
                        className="text-sm leading-none font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {task.task_name}
                      </label>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groupedTasks.completed.length > 0 && (
              <div>
                <h4 className="text-muted-foreground mb-2 text-sm font-medium">Completed</h4>
                <div className="space-y-2">
                  {groupedTasks.completed.map(task => (
                    <div key={task.id} className="flex items-center gap-2">
                      <input type="checkbox" id={task.id.toString()} className="accent-primary" checked readOnly />
                      <label
                        htmlFor={`task-${task.id}`}
                        className="text-muted-foreground text-sm leading-none font-medium line-through peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {task.task_name}
                      </label>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tasks.length === 0 && (
              <div className="text-muted-foreground text-center">
                No tasks yet. Add your first task to get started.
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
