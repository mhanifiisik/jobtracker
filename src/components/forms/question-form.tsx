import { questionSchema } from "@/schemas/question-schemas";
import { useAuthStore } from "@/store/auth";
import { useQuestionsStore } from "@/store/questions";
import type { Question } from "@/types/db-tables";
import { useFormik } from "formik";
import { Plus } from "lucide-react";
import { useEffect } from "react";




export const QuestionForm = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  const formik = useFormik({
    initialValues: {
      title: '',
      url: '',
      difficulty: 'easy' as Question['difficulty'],
      category_id: 0,
      notes: '',
      user_id: userId ?? '',
    },
    validationSchema: questionSchema,
    onSubmit: async (values) => {
      await createQuestion(values);
    },
  });

  const { categories , fetchCategories ,createQuestion} = useQuestionsStore();

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);





  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="text-foreground mb-2 block text-sm font-medium">
          Question Title
        </label>
        <input
          type="text"
          id="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          className="bg-background border-input focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
          placeholder="e.g., Two Sum, Valid Parentheses"
          required
        />
      </div>

      <div>
        <label htmlFor="url" className="text-foreground mb-2 block text-sm font-medium">
          LeetCode URL (Optional)
        </label>
        <input
          type="url"
          id="url"
          value={formik.values.url}
          onChange={formik.handleChange}
          className="bg-background border-input focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
          placeholder="https://leetcode.com/problems/..."
        />
      </div>

      <div>
        <label htmlFor="difficulty" className="text-foreground mb-2 block text-sm font-medium">
          Difficulty
        </label>
        <select
          id="difficulty"
          value={formik.values.difficulty ?? 'easy'}
          onChange={formik.handleChange}
          className="bg-background border-input focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div>
        <label htmlFor="category" className="text-foreground mb-2 block text-sm font-medium">
          Category (Optional)
        </label>
        <select
          id="category"
          value={formik.values.category_id}
          onChange={(e) => formik.setFieldValue('category_id', Number(e.target.value))}
          className="bg-background border-input focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="text-foreground mb-2 block text-sm font-medium">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={formik.values.notes}
          onChange={formik.handleChange}
          className="bg-background border-input focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
          rows={4}
          placeholder="Add any notes or hints about the question..."
        />
      </div>

      <button
        type="submit"
        className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-white transition-colors"
      >
        <Plus size={16} /> Add Question
      </button>
    </form>
  );
};