import { useMutateData } from '@/hooks/use-mutate-data';
import { useFetchData } from '@/hooks/use-fetch-data';
import { QuestionDifficulty } from '@/constants/question-difficulty.enum';
import { useSession } from '@/hooks/use-session';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { MutationType } from '@/constants/mutation-type.enum';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router';

const LeetCodeAddPage = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const userId = session?.user.id;

  const { data: categories } = useFetchData<'question_categories'>('question_categories', {
    userId,
  });

  const questionMutation = useMutateData('questions', MutationType.INSERT);
  const progressMutation = useMutateData('user_question_progress', MutationType.INSERT);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    difficulty: Yup.mixed()
      .oneOf(Object.values(QuestionDifficulty))
      .required('Difficulty is required'),
    category_id: Yup.string().nullable(),
    url: Yup.string().url('Invalid URL format').nullable(),
    notes: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      difficulty: QuestionDifficulty.Medium,
      category_id: '',
      url: '',
      notes: '',
    },
    validationSchema,
    onSubmit: async values => {
      if (!userId) {
        toast.error('You must be logged in to add questions');
        return;
      }

      const result = (await questionMutation.mutateAsync({
        title: values.title,
        difficulty: values.difficulty,
        category_id: values.category_id || null,
        url: values.url || null,
        notes: values.notes || null,
        user_id: userId,
      })) as { data: { id: number }[] };

      const newQuestion = result.data as { id: number }[];

      if (newQuestion[0]) {
        await progressMutation.mutateAsync({
          user_id: userId,
          question_id: newQuestion[0].id,
          status: 'NOT_STARTED',
          times_solved: 0,
        });

        toast.success('Question added successfully');
        await navigate('/dashboard/leetcode');
      }
    },
  });

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Link to="/dashboard/leetcode" className="text-primary mb-6 flex items-center gap-2">
        <ArrowLeft size={16} /> Back to Questions
      </Link>

      <h1 className="text-foreground mb-6 text-2xl font-bold">Add New Question</h1>

      <form
        onSubmit={formik.handleSubmit}
        className="bg-card border-border space-y-6 rounded-lg border p-6"
      >
        <div>
          <label htmlFor="title" className="text-foreground mb-1 block text-sm font-medium">
            Question Title*
          </label>
          <input
            id="title"
            type="text"
            name="title"
            className="bg-background border-border focus:ring-primary w-full rounded border p-2 focus:ring-2 focus:outline-none"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-sm text-red-600">{formik.errors.title}</div>
          )}
        </div>

        <div>
          <label htmlFor="difficulty" className="text-foreground mb-1 block text-sm font-medium">
            Difficulty*
          </label>
          <select
            id="difficulty"
            name="difficulty"
            className="bg-background border-border focus:ring-primary w-full rounded border p-2 focus:ring-2 focus:outline-none"
            value={formik.values.difficulty}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {Object.values(QuestionDifficulty).map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
          {formik.touched.difficulty && formik.errors.difficulty && (
            <div className="text-sm text-red-600">{formik.errors.difficulty}</div>
          )}
        </div>

        <div>
          <label htmlFor="category_id" className="text-foreground mb-1 block text-sm font-medium">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            className="bg-background border-border focus:ring-primary w-full rounded border p-2 focus:ring-2 focus:outline-none"
            value={formik.values.category_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">None</option>
            {categories?.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="url" className="text-foreground mb-1 block text-sm font-medium">
            Question URL
          </label>
          <input
            id="url"
            type="url"
            name="url"
            className="bg-background border-border focus:ring-primary w-full rounded border p-2 focus:ring-2 focus:outline-none"
            value={formik.values.url}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="https://leetcode.com/problems/..."
          />
          {formik.touched.url && formik.errors.url && (
            <div className="text-sm text-red-600">{formik.errors.url}</div>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="text-foreground mb-1 block text-sm font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            className="bg-background border-border focus:ring-primary w-full rounded border p-2 focus:ring-2 focus:outline-none"
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 w-full rounded py-2 text-white transition-colors"
        >
          Add Question
        </button>
      </form>
    </div>
  );
};

export default LeetCodeAddPage;
