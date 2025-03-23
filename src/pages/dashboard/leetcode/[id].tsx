import { useFetchData } from '@/hooks/use-fetch-data';
import { useMutateData } from '@/hooks/use-mutate-data';
import { useSession } from '@/hooks/use-session';
import { ArrowLeft, ExternalLink, Clock, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { QuestionDifficulty } from '@/constants/question-difficulty.enum';
import toast from 'react-hot-toast';
import type { Question } from '@/types/question';
import type { UserQuestionProgress } from '@/types/user-question-progress';
import type { QuestionCategory } from '@/types/question-category';
import { Link, useNavigate, useParams } from 'react-router';
import { MutationType } from '@/constants/mutation-type.enum';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { validationSchema } from '@/schemas/leetcode-schemas';

interface QuestionWithProgress extends Question {
  user_question_progress?: UserQuestionProgress;
}

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useSession();
  const userId = session?.user.id;

  const [isEditing, setIsEditing] = useState(false);
  const { data: questions, isLoading } = useFetchData<'questions'>('questions', {
    select: '*, user_question_progress(*)',
    userId,
  }) as { data: QuestionWithProgress[] | null; isLoading: boolean };

  const { data: categories } = useFetchData<'question_categories'>('question_categories', {
    userId,
  }) as { data: QuestionCategory[] | null };

  const question = questions?.find(q => q.id === Number(id));

  const updateQuestionMutation = useMutateData('questions', MutationType.UPDATE);
  const updateProgressMutation = useMutateData('user_question_progress', MutationType.UPSERT);
  const deleteQuestionMutation = useMutateData('questions', MutationType.DELETE);

  const handleMarkSolved = async () => {
    if (!userId || !question) return;

    await updateProgressMutation.mutateAsync({
      user_id: userId,
      question_id: question.id,
      status: 'SOLVED',
      times_solved: (question.user_question_progress?.times_solved ?? 0) + 1,
      last_solved_at: new Date().toISOString(),
    });

    toast.success('Question marked as solved!');
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleDeleteQuestion = async () => {
    if (!question) return;
    await deleteQuestionMutation.mutateAsync({ id: question.id });
    toast.success('Question deleted');
    await navigate('/dashboard/leetcode');
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  if (!question) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Link to="/dashboard/leetcode" className="text-primary mb-6 flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Questions
        </Link>
        <div className="border-border rounded-lg border py-12 text-center">
          <p className="text-foreground text-xl font-medium">Question not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Link to="/dashboard/leetcode" className="text-primary mb-6 flex items-center gap-2">
        <ArrowLeft size={16} /> Back to Questions
      </Link>

      <div className="bg-card border-border rounded-lg border p-6">
        {isEditing ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-foreground text-2xl font-bold">Edit Question</h1>
              <button
                type="button"
                onClick={toggleEdit}
                className="bg-muted hover:bg-muted/80 rounded px-4 py-2"
              >
                Cancel
              </button>
            </div>

            <Formik
              initialValues={{
                title: question.title,
                difficulty: question.difficulty,
                category_id: question.category_id?.toString() ?? '',
                url: question.url ?? '',
                notes: question.notes ?? '',
              }}
              validationSchema={validationSchema}
              onSubmit={async values => {
                await updateQuestionMutation.mutateAsync({
                  id: question.id,
                  ...values,
                  category_id: values.category_id || null,
                  url: values.url || null,
                  notes: values.notes || null,
                });
                setIsEditing(false);
                toast.success('Question updated successfully');
              }}
            >
              {({ values, handleChange, handleBlur }) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="text-foreground mb-1 block text-sm font-medium"
                    >
                      Question Title*
                    </label>
                    <Field
                      id="title"
                      name="title"
                      type="text"
                      className="bg-background border-border focus:ring-primary w-full rounded border p-2 focus:ring-2 focus:outline-none"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.title}
                    />
                    <ErrorMessage name="title" component="div" className="text-sm text-red-500" />
                  </div>

                  <div>
                    <label
                      htmlFor="difficulty"
                      className="text-foreground mb-1 block text-sm font-medium"
                    >
                      Difficulty*
                    </label>
                    <Field
                      as="select"
                      id="difficulty"
                      name="difficulty"
                      className="bg-background border-border focus:ring-primary w-full rounded border p-2 focus:ring-2 focus:outline-none"
                    >
                      {Object.values(QuestionDifficulty).map(difficulty => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="difficulty"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="category_id"
                      className="text-foreground mb-1 block text-sm font-medium"
                    >
                      Category
                    </label>
                    <Field
                      as="select"
                      id="category_id"
                      name="category_id"
                      className="bg-background border-border focus:ring-primary w-full rounded border p-2 focus:ring-2 focus:outline-none"
                    >
                      <option value="">None</option>
                      {categories?.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category_id"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="url" className="text-foreground mb-1 block text-sm font-medium">
                      Question URL
                    </label>
                    <Field
                      id="url"
                      name="url"
                      type="url"
                      className="bg-background border-border focus:ring-primary w-full rounded border p-2 focus:ring-2 focus:outline-none"
                      placeholder="https://leetcode.com/problems/..."
                    />
                    <ErrorMessage name="url" component="div" className="text-sm text-red-500" />
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="text-foreground mb-1 block text-sm font-medium"
                    >
                      Notes
                    </label>
                    <Field
                      as="textarea"
                      id="notes"
                      name="notes"
                      className="bg-background border-border focus:ring-primary w-full rounded border p-2 focus:ring-2 focus:outline-none"
                      rows={6}
                    />
                    <ErrorMessage name="notes" component="div" className="text-sm text-red-500" />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 flex-1 rounded py-2 text-white transition-colors"
                    >
                      Update Question
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void (async () => {
                          await handleDeleteQuestion();
                        })();
                      }}
                      className="bg-destructive hover:bg-destructive/90 rounded px-4 py-2 text-white transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-start justify-between">
              <h1 className="text-foreground text-2xl font-bold">{question.title}</h1>
              <button
                type="button"
                onClick={toggleEdit}
                className="text-primary hover:bg-primary/10 rounded p-2"
                aria-label="Edit question"
              >
                <Edit size={18} />
              </button>
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  question.difficulty === QuestionDifficulty.Easy
                    ? 'bg-green-100 text-green-800'
                    : question.difficulty === QuestionDifficulty.Medium
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {question.difficulty}
              </span>

              {question.category_name && (
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                  {question.category_name}
                </span>
              )}

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  question.user_question_progress?.status === 'SOLVED'
                    ? 'bg-green-100 text-green-800'
                    : question.user_question_progress?.status === 'ATTEMPTED'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                {question.user_question_progress?.status ?? 'NOT_STARTED'}
              </span>
            </div>

            <div className="mb-6 space-y-4">
              {question.url && (
                <a
                  href={question.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary flex items-center gap-2 hover:underline"
                >
                  <ExternalLink size={16} /> Open on LeetCode
                </a>
              )}

              <div className="text-muted-foreground flex items-center gap-2">
                <CheckCircle size={16} />
                <span>Solved {question.user_question_progress?.times_solved ?? 0} times</span>
              </div>

              {question.user_question_progress?.last_solved_at && (
                <div className="text-muted-foreground flex items-center gap-2">
                  <Clock size={16} />
                  <span>
                    Last solved on{' '}
                    {new Date(question.user_question_progress.last_solved_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {question.notes && (
              <div className="mb-8">
                <h3 className="text-foreground mb-2 text-lg font-medium">Notes</h3>
                <div className="bg-background border-border rounded border p-4 whitespace-pre-wrap">
                  {question.notes}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  void (async () => {
                    await handleMarkSolved();
                  })();
                }}
                className="bg-primary hover:bg-primary/90 flex-1 rounded py-3 text-white transition-colors"
              >
                Mark as Solved
              </button>
              <button
                type="button"
                onClick={() => {
                  void (async () => {
                    await handleDeleteQuestion();
                  })();
                }}
                className="bg-destructive hover:bg-destructive/90 rounded px-4 py-3 text-white transition-colors"
                aria-label="Delete question"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetailPage;
