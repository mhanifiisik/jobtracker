import { useState } from 'react'
import { useFetchData } from '@/hooks/use-fetch-data'
import { useMutateData } from '@/hooks/use-mutate-data'
import { QuestionDifficulty } from '@/constants/question-difficulty.enum'
import { useSession } from '@/hooks/use-session'
import type { Question } from '@/types/question'
import type { UserQuestionProgress } from '@/types/user-question-progress'
import { Plus, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router'
import { MutationType } from '@/constants/mutation-type.enum'

interface QuestionWithProgress extends Question {
  user_question_progress?: UserQuestionProgress
}

interface Category {
  id: number
  name: string
  user_id: string
}

const LeetCodePage = () => {
  const { session } = useSession()
  const userId = session?.user.id
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'ALL'>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: questions, isLoading } = useFetchData<'questions'>('questions', {
    select: '*, user_question_progress(*)',
    userId
  }) as { data: QuestionWithProgress[] | null; isLoading: boolean }

  const { data: categories } = useFetchData('question_categories', {
    userId
  }) as { data: Category[] | null; isLoading: boolean }

  const updateProgressMutation = useMutateData('user_question_progress', MutationType.UPSERT)

  const handleQuestionSolved = async (questionId: number) => {
    if (!userId) return

    const existingProgress = questions?.find((q) => q.id === questionId)?.user_question_progress

    try {
      await updateProgressMutation.mutateAsync({
        user_id: userId,
        question_id: questionId,
        status: 'SOLVED',
        times_solved: (existingProgress?.times_solved ?? 0) + 1,
        last_solved_at: new Date().toISOString()
      })
      toast.success('Question marked as solved!')
    } catch (error) {
      toast.error('Failed to update progress')
      console.error(error)
    }
  }

  const getDifficultyColor = (difficulty: QuestionDifficulty) => {
    switch (difficulty) {
      case QuestionDifficulty.Easy:
        return 'bg-green-100 text-green-800'
      case QuestionDifficulty.Medium:
        return 'bg-yellow-100 text-yellow-800'
      case QuestionDifficulty.Hard:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'SOLVED':
        return 'bg-green-100 text-green-800'
      case 'ATTEMPTED':
        return 'bg-yellow-100 text-yellow-800'
      case 'NOT_STARTED':
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>
  }

  const filteredQuestions = questions?.filter(
    (q) =>
      (selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty) &&
      (selectedCategory === 'ALL' || q.category_id?.toString() === selectedCategory) &&
      q.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              onChange={(e) => {
                setSearchQuery(e.target.value)
              }}
            />
          </div>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => {
              setSelectedDifficulty('ALL')
            }}
            className={`rounded px-4 py-2 whitespace-nowrap ${
              selectedDifficulty === 'ALL' ? 'bg-primary text-white' : 'bg-card border'
            }`}
          >
            All Difficulties
          </button>
          {Object.values(QuestionDifficulty).map((difficulty) => (
            <button
              key={difficulty}
              type="button"
              onClick={() => {
                setSelectedDifficulty(difficulty)
              }}
              className={`rounded px-4 py-2 whitespace-nowrap ${
                selectedDifficulty === difficulty ? 'bg-primary text-white' : 'bg-card border'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>

        {categories && categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ALL')
              }}
              className={`rounded px-4 py-2 whitespace-nowrap ${
                selectedCategory === 'ALL' ? 'bg-secondary text-white' : 'bg-card border'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(category.id.toString())
                }}
                className={`rounded px-4 py-2 whitespace-nowrap ${
                  selectedCategory === category.id.toString()
                    ? 'bg-secondary text-white'
                    : 'bg-card border'
                }`}
              >
                {category.name}
              </button>
            ))}
            <Link
              to="/dashboard/leetcode/categories"
              className="bg-card hover:bg-muted flex items-center gap-1 rounded border px-4 py-2 whitespace-nowrap"
            >
              <Plus size={14} /> Manage Categories
            </Link>
          </div>
        )}
      </div>

      {!filteredQuestions || filteredQuestions.length === 0 ? (
        <div className="border-muted bg-background flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4 text-lg">No questions found</p>
          <p className="text-muted-foreground text-sm">Add your first question to start tracking</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="border-border bg-card rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-foreground mb-2 text-lg font-semibold">{question.title}</h3>
              <div className="mb-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${getDifficultyColor(question.difficulty)}`}
                >
                  {question.difficulty}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(question.user_question_progress?.status)}`}
                >
                  {question.user_question_progress?.status ?? 'NOT_STARTED'}
                </span>
                {question.category_name && (
                  <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-800">
                    {question.category_name}
                  </span>
                )}
              </div>

              <div className="text-muted-foreground mb-4 flex items-center justify-between text-sm">
                <span>Solved: {question.user_question_progress?.times_solved ?? 0} times</span>
                {question.user_question_progress?.last_solved_at && (
                  <span>
                    Last:{' '}
                    {new Date(question.user_question_progress.last_solved_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuestionSolved(question.id)}
                  className="bg-primary hover:bg-primary/90 flex-1 rounded py-2 text-white transition-colors"
                >
                  Mark as Solved
                </button>
                <Link
                  to={`/dashboard/leetcode/${String(question.id)}`}
                  className="bg-muted hover:bg-muted/80 rounded px-3 py-2 transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LeetCodePage
