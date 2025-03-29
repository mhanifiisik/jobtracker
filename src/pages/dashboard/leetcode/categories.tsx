import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useFetchData } from '@/hooks/use-fetch-data';
import { useMutateData } from '@/hooks/use-mutate-data';
import { useSession } from '@/hooks/use-session';
import Loader from '@/components/ui/loading';
import toast from 'react-hot-toast';
import { MutationType } from '@/constants/mutation-type.enum';


const CategoryForm = () => {
  const { session } = useSession();
  const userId = session?.user.id;
  const [name, setName] = useState('');

  const { mutateAsync: createCategory } = useMutateData('question_categories', MutationType.INSERT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !name.trim()) return;

    try {
      await createCategory({
        name: name.trim(),
        user_id: userId,
      });
      setName('');
      toast.success('Category created successfully!');
    } catch (error) {
      toast.error('Failed to create category');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-foreground mb-2 block text-sm font-medium">
          Category Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          className="bg-background border-input focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
          placeholder="e.g., Arrays, Strings, Trees"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-white transition-colors"
      >
        <Plus size={16} /> Create Category
      </button>
    </form>
  );
};

const CategoriesPage = () => {
  const { session } = useSession();
  const userId = session?.user.id;

  const { data: categories, isLoading } = useFetchData('question_categories', {
    userId,
    orderBy: 'id',
    order: 'asc',
  });

  const { mutateAsync: deleteCategory } = useMutateData('question_categories', MutationType.DELETE);

  const handleDelete = async (categoryId: number) => {
    try {
      await deleteCategory({
        id: categoryId,
      });
      toast.success('Category deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete category');
      console.error(error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

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
            <h1 className="text-foreground text-2xl font-bold">Manage Categories</h1>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-foreground mb-4 text-lg font-semibold">Add New Category</h2>
            <CategoryForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-foreground mb-4 text-lg font-semibold">Existing Categories</h2>
            {!categories || categories.length === 0 ? (
              <p className="text-muted-foreground text-sm">No categories found</p>
            ) : (
              <div className="space-y-4">
                {categories.map(category => (
                  <div
                    key={category.id}
                    className="border-border flex items-center justify-between rounded-lg border p-4"
                  >
                    <span className="text-foreground">{category.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(category.id)}
                      className="text-destructive hover:text-destructive/90 flex items-center gap-1 rounded px-3 py-1 text-sm transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;