import type { Question} from '@/types/leetcode';
import { Link } from 'react-router';

interface QuestionCardProps {
  question: Question;
  onMarkAsSolved: (questionId: number) => Promise<void>;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

const statusColors = {
  'not started': 'bg-gray-100 text-gray-800',
  attempted: 'bg-yellow-100 text-yellow-800',
  solved: 'bg-green-100 text-green-800',
};

export const QuestionCard = ({ question, onMarkAsSolved }: QuestionCardProps) => {
  const progress = question.user_question_progress;
  const status = progress?.status ?? 'not started';

  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="text-foreground mb-2 text-lg font-semibold">{question.title}</h3>

      <div className="mb-4 flex flex-wrap gap-2">
        {question.difficulty && (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              difficultyColors[question.difficulty]
            }`}
          >
            {question.difficulty}
          </span>
        )}
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            statusColors[status]
          }`}
        >
          {status}
        </span>
        {question.category_name && (
          <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-800">
            {question.category_name}
          </span>
        )}
      </div>

      <div className="text-muted-foreground mb-4 flex items-center justify-between text-sm">
        <span>Solved: {progress?.times_solved ?? 0} times</span>
        {progress?.last_solved_at && (
          <span>
            Last: {new Date(progress.last_solved_at).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onMarkAsSolved(question.id)}
          className="bg-primary hover:bg-primary/90 flex-1 rounded py-2 text-white transition-colors"
        >
          Mark as Solved
        </button>
        <Link
          to={`/dashboard/leetcode/${question.id}`}
          className="bg-muted hover:bg-muted/80 rounded px-3 py-2 transition-colors"
        >
          Details
        </Link>
      </div>
    </div>
  );
};