import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Plus } from 'lucide-react';
import type { Database } from '@/types/database';
import { useFetchData } from '@/hooks/use-fetch-data';
import { useMutateData } from '@/hooks/use-mutate-data';
import { useSession } from '@/hooks/use-session';
import toast from 'react-hot-toast';
import { MutationType } from '@/constants/mutation-type.enum';

type QuestionDifficulty = Database['public']['Enums']['difficulty_enum'];

const QuestionForm = () => {
  const { session } = useSession();
  const userId = session?.user.id;
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('easy');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  const { data: categories } = useFetchData('question_categories', {
    userId,
    orderBy: 'name',
    order: 'asc',
  });

  const { mutateAsync: createQuestion } = useMutateData('questions', MutationType.INSERT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !title.trim()) return;

    try {
      await createQuestion({
        title: title.trim(),
        url: url.trim(),
        difficulty,
        category_id: categoryId,
        notes: notes.trim(),
        user_id: userId,
      });
      setTitle('');
      setUrl('');
      setDifficulty('easy');
      setCategoryId(null);
      setNotes('');
      toast.success('Question added successfully!');
    } catch (error) {
      toast.error('Failed to add question');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="text-foreground mb-2 block text-sm font-medium">
          Question Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
          }}
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
          value={url}
          onChange={e => {
            setUrl(e.target.value);
          }}
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
          value={difficulty}
          onChange={e => {
            setDifficulty(e.target.value as QuestionDifficulty);
          }}
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
          value={categoryId ?? ''}
          onChange={e => {
            setCategoryId(e.target.value ? Number(e.target.value) : null);
          }}
          className="bg-background border-input focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
        >
          <option value="">Select a category</option>
          {categories?.map(category => (
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
          value={notes}
          onChange={e => {
            setNotes(e.target.value);
          }}
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

const AddQuestionPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard/leetcode"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Questions
            </Link>
            <h1 className="text-foreground text-2xl font-bold">Add New Question</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="bg-card rounded-lg border p-6">
          <QuestionForm />
        </div>
      </div>
    </div>
  );
};

export default AddQuestionPage;