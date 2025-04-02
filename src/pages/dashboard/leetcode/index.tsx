import { useEffect, useMemo, useState, useRef } from "react"
import { Plus, Search, Filter,  ChevronDown } from "lucide-react"
import { useProgressStore } from "@/store/progress"
import { useQuestionsStore } from "@/store/questions"
import type { Question } from "@/types/db-tables"
import { AddQuestionDialog } from "@/components/leetcode/add-question-dialog"
import { Link } from "react-router"
import QuestionsSection from "@/components/leetcode/questions-section"


function LeetCodePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Question["difficulty"] | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [isDifficultyDropdownOpen, setIsDifficultyDropdownOpen] = useState(false)

  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const difficultyDropdownRef = useRef<HTMLDivElement>(null)

  const { questions, categories, fetchQuestions, fetchCategories } = useQuestionsStore()
  const {progress, fetchProgress, updateProgress } = useProgressStore()

  useEffect(() => {
    void fetchQuestions()
    void fetchCategories()
    void fetchProgress()
  }, [fetchQuestions, fetchCategories, fetchProgress])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false)
      }
      if (difficultyDropdownRef.current && !difficultyDropdownRef.current.contains(event.target as Node)) {
        setIsDifficultyDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const stats = useMemo(() => {
    const total = questions.length
    const solved = progress.filter((q) => q.status === "solved").length

    const totalTimesSolved= progress.reduce((sum, q) => sum + (q.times_solved ?? 0), 0)


    const easy = questions.filter((q) => q.difficulty === "easy").length
    const medium = questions.filter((q) => q.difficulty === "medium").length
    const hard = questions.filter((q) => q.difficulty === "hard").length

    const easySolved = progress.filter(
      (q) => q.question_id && questions.find((q) => q.id === q.id)?.difficulty === "easy" && q.status === "solved",
    ).length
    const mediumSolved = progress.filter(
      (q) => q.question_id && questions.find((q) => q.id === q.id)?.difficulty === "medium" && q.status === "solved",
    ).length
    const hardSolved = progress.filter(
        (q) => q.question_id && questions.find((q) => q.id === q.id)?.difficulty === "hard" && q.status === "solved",
    ).length

    return {
      total,
      solved,
      totalProgress: total > 0 ? (solved / total) * 100 : 0,
      easy,
      medium,
      hard,
      easySolved,
      mediumSolved,
      hardSolved,
      easyProgress: easy > 0 ? (easySolved / easy) * 100 : 0,
      mediumProgress: medium > 0 ? (mediumSolved / medium) * 100 : 0,
      hardProgress: hard > 0 ? (hardSolved / hard) * 100 : 0,
      totalTimesSolved,
    }
  }, [questions,progress])

  // Filter questions based on search, difficulty, and category
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch = searchQuery ? question.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
      const matchesDifficulty = selectedDifficulty ? question.difficulty === selectedDifficulty : true
      const matchesCategory = selectedCategory ? question.category_id === selectedCategory : true

      return matchesSearch && matchesDifficulty && matchesCategory
    })
  }, [questions, searchQuery, selectedDifficulty, selectedCategory])



  return (
       <div className="w-full">
      <main className="mx-auto max-w-[100rem] px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">LeetCode Progress</h1>
          <p className="text-gray-500 mt-1">Track your coding interview preparation</p>
        </div>
        <button
        type='button'
          onClick={() => {
            setIsAddDialogOpen(true)
          }}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Overall Progress Card */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="pb-2">
            <h3 className="text-lg font-medium">Overall Progress</h3>
          </div>
          <div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">
                {stats.solved}/{stats.total}
              </div>
              <div className="text-xl font-medium text-gray-500">{stats.totalProgress.toFixed(0)}%</div>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full mt-2">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${stats.totalProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Easy Card */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="pb-2">
            <h3 className="text-lg font-medium text-green-500">Easy</h3>
          </div>
          <div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">
                {stats.easySolved}/{stats.easy}
              </div>
              <div className="text-xl font-medium text-gray-500">{stats.easyProgress.toFixed(0)}%</div>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full mt-2">
              <div
                className="h-2 bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${stats.easyProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Medium Card */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="pb-2">
            <h3 className="text-lg font-medium text-yellow-500">Medium</h3>
          </div>
          <div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">
                {stats.mediumSolved}/{stats.medium}
              </div>
              <div className="text-xl font-medium text-gray-500">{stats.mediumProgress.toFixed(0)}%</div>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full mt-2">
              <div
                className="h-2 bg-yellow-500 rounded-full transition-all duration-300"
                style={{ width: `${stats.mediumProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Hard Card */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="pb-2">
            <h3 className="text-lg font-medium text-red-500">Hard</h3>
          </div>
          <div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">
                {stats.hardSolved}/{stats.hard}
              </div>
              <div className="text-xl font-medium text-gray-500">{stats.hardProgress.toFixed(0)}%</div>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full mt-2">
              <div
                className="h-2 bg-red-500 rounded-full transition-all duration-300"
                style={{ width: `${stats.hardProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2">
          {/* Category Dropdown */}
          <div className="relative" ref={categoryDropdownRef}>
            <button
            type='button'
              onClick={() => {
                setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
              }}
              className="inline-flex items-center justify-between w-[180px] px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name : "All Categories"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
                <div className="py-1">
                  <button
                    type='button'
                    onClick={() => {
                      setSelectedCategory(null)
                      setIsCategoryDropdownOpen(false)
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type='button'
                      onClick={() => {
                        setSelectedCategory(category.id)
                        setIsCategoryDropdownOpen(false)
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      {category.name}
                    </button>
                  ))}

                  <Link
                    to="/dashboard/leetcode/categories"
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center justify-center gap-2"
                  >
                    Add Category <Plus className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Difficulty Dropdown */}
          <div className="relative" ref={difficultyDropdownRef}>
            <button
            type='button'
              onClick={() => {
                setIsDifficultyDropdownOpen(!isDifficultyDropdownOpen)
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <Filter className="h-4 w-4" />
              {selectedDifficulty
                ? selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)
                : "Difficulty"}
            </button>

            {isDifficultyDropdownOpen && (
              <div className="absolute right-0 z-10 mt-1 w-40 bg-white border rounded-md shadow-lg">
                <div className="py-1">
                  <button
                    type='button'
                    onClick={() => {
                      setSelectedDifficulty(null)
                      setIsDifficultyDropdownOpen(false)
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    All Difficulties
                  </button>
                  <button
                  type='button'
                    onClick={() => {
                      setSelectedDifficulty("easy")
                      setIsDifficultyDropdownOpen(false)
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    Easy
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setSelectedDifficulty("medium")
                      setIsDifficultyDropdownOpen(false)
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    Medium
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setSelectedDifficulty("hard")
                      setIsDifficultyDropdownOpen(false)
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    Hard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <QuestionsSection
        questions={filteredQuestions}
        categories={categories}
        progress={progress}
        updateProgress={updateProgress}
        setIsAddDialogOpen={setIsAddDialogOpen}
      />

      <AddQuestionDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </main>
    </div>
  )
}


export default LeetCodePage;