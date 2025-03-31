import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Plus, Search } from 'lucide-react';
import type {  QuestionDifficulty } from '@/types/leetcode';
import { QuestionCard } from '@/components/leetcode/question-card';
import toast from 'react-hot-toast';
import { useQuestionsStore } from '@/store/questions';
import { useProgressStore } from '@/store/progress';

const DIFFICULTIES: QuestionDifficulty[] = ['easy', 'medium', 'hard'];

const LeetCodePage = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { questions, categories, fetchQuestions, fetchCategories } = useQuestionsStore();
  const { progress, updateProgress } = useProgressStore();

  useEffect(() => {
    void fetchQuestions();
    void fetchCategories();
  }, [fetchQuestions, fetchCategories]);

  const handleMarkAsSolved = async (questionId: number) => {
    const existingProgress = progress.find(p => p.question_id === questionId);

    try {
      await updateProgress(questionId, {
        status: 'solved',
        times_solved: (existingProgress?.times_solved ?? 0) + 1, // Increment times solved
        last_solved_at: new Date().toISOString()
      });
      toast.success('Question marked as solved!');
    } catch (error) {
      toast.error('Failed to update progress');
      console.error(error);
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(
      q =>
        (selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty) &&
        q.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [questions, selectedDifficulty, searchQuery]);

  // Restructured to return an array of category objects with their questions
  const categorizedQuestions = useMemo(() => {
    return categories
      .map(category => {
        const categoryQuestions = filteredQuestions.filter(q => q.category_id === category.id);
        return {
          category,
          questions: categoryQuestions
        };
      })
      .filter(item => item.questions.length > 0); // Only keep categories with questions
  }, [categories, filteredQuestions]);

  const uncategorizedQuestions = useMemo(() => {
    return filteredQuestions.filter(q => !q.category_id);
  }, [filteredQuestions]);

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

      {filteredQuestions.length === 0 ? (
        <div className="border-muted bg-background flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4 text-lg">No questions found</p>
          <p className="text-muted-foreground text-sm">Add your first question to start tracking</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Render categorized questions */}
          {categorizedQuestions.map(({ category, questions }) => (
            <div key={category.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground text-lg font-semibold">{category.name}</h3>
                <div className="text-muted-foreground text-sm">
                  {questions.length} questions
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {questions.map(question => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    onMarkAsSolved={handleMarkAsSolved}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Render uncategorized questions */}
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