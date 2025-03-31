import { Code, CheckCircle, ArrowRight } from 'lucide-react';
import { useProgressStore } from '@/store/progress';
import { useEffect } from 'react';
import { useQuestionsStore } from '@/store/questions';

export default function ProgressCard() {

  const { questions, fetchQuestions } = useQuestionsStore();
  const { progress, fetchProgress } = useProgressStore();

  useEffect(() => {
    void fetchQuestions();
    void fetchProgress();
  }, [fetchQuestions, fetchProgress]);

  const totalQuestions = questions.length;
  const solvedQuestions =
    progress.filter(progress => progress.status === 'solved').length;
  const attemptingQuestions =
    progress.filter(progress => progress.status === 'attempted').length;

  const totalProgressPercentage =
    totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0;

  const difficulties = [
    { name: 'Easy', textColor: 'text-chart-1 dark:text-chart-1/90' },
    { name: 'Medium', textColor: 'text-chart-2 dark:text-chart-2/90' },
    { name: 'Hard', textColor: 'text-chart-3 dark:text-chart-3/90' },
  ].map(diff => {
    const total = questions.filter(q => q.difficulty === diff.name.toLowerCase()).length;
    const solved =
      progress.filter(
        progress =>
          progress.status === 'solved' &&
          questions.find(q => q.id === progress.question_id)?.difficulty ===
            diff.name.toLowerCase()
      ).length;

    return {
      ...diff,
      total,
      solved,
    };
  });

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm md:col-span-3 lg:col-span-7">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="font-medium text-foreground">Progress Overview</h3>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-sm text-primary dark:bg-primary/25">
            <CheckCircle className="h-4 w-4" />
            <span>{totalProgressPercentage}% Complete</span>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-1">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total Progress</span>
            <div>
              <span className="text-2xl font-semibold text-foreground">{solvedQuestions}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{totalQuestions}</span>
              <span className="ml-1 text-sm text-muted-foreground">solved</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {attemptingQuestions} questions currently attempting
          </div>
        </div>

        <div className="space-y-4 border-t border-border pt-4">
          <h4 className="text-sm font-medium text-muted-foreground">BY DIFFICULTY</h4>

          <div className="grid gap-4 sm:grid-cols-3">
            {difficulties.map(difficulty => (
              <div
                key={difficulty.name}
                className="flex flex-col rounded-md border border-border bg-card/50 p-4"
              >
                <span className={`text-sm font-medium ${difficulty.textColor}`}>
                  {difficulty.name}
                </span>
                <div className="mt-1 flex items-baseline">
                  <span className="text-xl font-semibold text-foreground">{difficulty.solved}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">{difficulty.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View All Questions
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
