import { useState } from 'react';
import { Link } from 'react-router';
import { Plus, Search } from 'lucide-react';
import type { Question, QuestionCategory, QuestionDifficulty } from '@/types/leetcode';
import { useFetchData } from '@/hooks/use-fetch-data';
import { useMutateData } from '@/hooks/use-mutate-data';
import { useSession } from '@/hooks/use-session';
import { QuestionCard } from '@/components/leetcode/question-card';
import Loader from '@/components/ui/loading';
import toast from 'react-hot-toast';
import { MutationType } from '@/constants/mutation-type.enum';

const DIFFICULTIES: QuestionDifficulty[] = ['easy', 'medium', 'hard'];

const LeetCodePage = () => {
  const { session } = useSession();
  const userId = session?.user.id;
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: questionsData, isLoading: isLoadingQuestions } = useFetchData('questions', {
    select: '*, user_question_progress(*), question_categories(name)',
    userId,
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useFetchData('question_categories', {
    userId,
    orderBy: 'id',
    order: 'asc',
  });

  const questions = questionsData as Question[] | null;
  const categories = categoriesData;

  const { mutateAsync: updateProgress } = useMutateData('user_question_progress', MutationType.UPSERT);

  const handleMarkAsSolved = async (questionId: number) => {
    if (!userId) return;

    const existingProgress = questions?.find(q => q.id === questionId)?.user_question_progress;

    try {
      await updateProgress({
        user_id: userId,
        question_id: questionId,
        status: 'solved',
        times_solved: (existingProgress?.times_solved ?? 0) + 1,
        last_solved_at: new Date().toISOString(),
      });
      toast.success('Question marked as solved!');
    } catch (error) {
      toast.error('Failed to update progress');
      console.error(error);
    }
  };

  if (isLoadingQuestions || isLoadingCategories) {
    return <Loader />;
  }

  const filteredQuestions = questions?.filter(
    q =>
      (selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty) &&
      q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const questionsByCategory = categories?.reduce((acc, category) => {
    const categoryQuestions = filteredQuestions?.filter(q => q.category_id === category.id) ?? [];
    if (categoryQuestions.length > 0) {
      acc[category.id] = {
        category,
        questions: categoryQuestions,
      };
    }
    return acc;
  }, {} as Record<number, { category: QuestionCategory; questions: Question[] }>);

  const uncategorizedQuestions = filteredQuestions?.filter(q => !q.category_id) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-foreground text-2xl font-bold">LeetCode Progress Tracker</h1>
          <Link
            to="/dashboard/leetcode/add"
            className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded px-4 py-2 text-white transition-colors"
          >
            <Plus size={16} /> Add Question
          </Link>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="bg-card flex flex-1 items-center rounded border px-3 py-2">
            <Search size={18} className="text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full border-none bg-transparent outline-none"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => {
              setSelectedDifficulty('ALL');
            }}
            className={`rounded px-4 py-2 whitespace-nowrap ${
              selectedDifficulty === 'ALL' ? 'bg-primary text-white' : 'bg-card border'
            }`}
          >
            All Difficulties
          </button>
          {DIFFICULTIES.map(difficulty => (
            <button
              key={difficulty}
              type="button"
              onClick={() => {
                setSelectedDifficulty(difficulty);
              }}
              className={`rounded px-4 py-2 whitespace-nowrap ${
                selectedDifficulty === difficulty ? 'bg-primary text-white' : 'bg-card border'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground text-xl font-semibold">Learning Path</h2>
          <Link
            to="/dashboard/leetcode/categories"
            className="bg-card hover:bg-muted flex items-center gap-1 rounded border px-4 py-2"
          >
            <Plus size={14} /> Manage Categories
          </Link>
        </div>
      </div>

      {!filteredQuestions || filteredQuestions.length === 0 ? (
        <div className="border-muted bg-background flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4 text-lg">No questions found</p>
          <p className="text-muted-foreground text-sm">Add your first question to start tracking</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories?.map(category => {
            const categoryData = questionsByCategory?.[category.id];
            if (!categoryData) return null;

            return (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-foreground text-lg font-semibold">{category.name}</h3>
                  <div className="text-muted-foreground text-sm">
                    {categoryData.questions.length} questions
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryData.questions.map(question => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      onMarkAsSolved={handleMarkAsSolved}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {uncategorizedQuestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground text-lg font-semibold">Uncategorized</h3>
                <div className="text-muted-foreground text-sm">
                  {uncategorizedQuestions.length} questions
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {uncategorizedQuestions.map(question => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    onMarkAsSolved={handleMarkAsSolved}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeetCodePage;
