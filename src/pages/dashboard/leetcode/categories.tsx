import { useState } from 'react';
import { useFetchData } from '@/hooks/use-fetch-data';
import { useMutateData } from '@/hooks/use-mutate-data';
import { useSession } from '@/hooks/use-session';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import { MutationType } from '@/constants/mutation-type.enum';

interface Category {
  id: number;
  name: string;
  user_id: string;
}

const CategoriesPage = () => {
  const { session } = useSession();
  const userId = session?.user.id;

  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);

  const { data: categories, isLoading } = useFetchData<'question_categories'>(
    'question_categories',
    {
      userId,
    }
  ) as { data: Category[] | null; isLoading: boolean };

  const insertMutation = useMutateData('question_categories', MutationType.INSERT);
  const updateMutation = useMutateData('question_categories', MutationType.UPDATE);
  const deleteMutation = useMutateData('question_categories', MutationType.DELETE);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newCategory.trim()) return;

    try {
      await insertMutation.mutateAsync({
        name: newCategory.trim(),
        user_id: userId,
      });

      setNewCategory('');
      toast.success('Category added');
    } catch (error) {
      toast.error('Failed to add category');
      console.error(error);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name.trim()) return;

    try {
      await updateMutation.mutateAsync({
        id: editingCategory.id,
        name: editingCategory.name.trim(),
      });

      setEditingCategory(null);
      toast.success('Category updated');
    } catch (error) {
      toast.error('Failed to update category');
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success('Category deleted');
      } catch (error) {
        toast.error('Failed to delete category');
        console.error(error);
      }
    }
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Link to="/dashboard/leetcode" className="text-primary mb-6 flex items-center gap-2">
        <ArrowLeft size={16} /> Back to Questions
      </Link>

      <h1 className="text-foreground mb-6 text-2xl font-bold">Manage Categories</h1>

      <form onSubmit={handleAddCategory} className="mb-6 flex gap-2">
        <input
          type="text"
          className="bg-background border-border focus:ring-primary flex-1 rounded border p-2 focus:ring-2 focus:outline-none"
          placeholder="New category name"
          value={newCategory}
          onChange={e => {
            setNewCategory(e.target.value);
          }}
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 rounded px-4 py-2 text-white"
          disabled={!newCategory.trim()}
        >
          Add Category
        </button>
      </form>

      {!categories || categories.length === 0 ? (
        <div className="border-border rounded-lg border py-12 text-center">
          <p className="text-muted-foreground">No categories yet. Add your first category above.</p>
        </div>
      ) : (
        <div className="bg-card border-border space-y-2 rounded-lg border p-4">
          {categories.map(category => (
            <div
              key={category.id}
              className="border-border flex items-center justify-between border-b p-3 last:border-b-0"
            >
              {editingCategory?.id === category.id ? (
                <form onSubmit={handleUpdateCategory} className="flex flex-1 gap-2">
                  <input
                    type="text"
                    className="bg-background border-border focus:ring-primary flex-1 rounded border p-2 focus:ring-2 focus:outline-none"
                    value={editingCategory.name}
                    onChange={e => {
                      setEditingCategory({ ...editingCategory, name: e.target.value });
                    }}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="rounded bg-green-500 px-3 text-white hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-muted hover:bg-muted/80 rounded px-3"
                    onClick={() => {
                      setEditingCategory(null);
                    }}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span className="text-foreground">{category.name}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory({ id: category.id, name: category.name });
                      }}
                      className="rounded p-1 text-blue-500 hover:bg-blue-50"
                      aria-label="Edit category"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-destructive hover:bg-destructive/10 rounded p-1"
                      aria-label="Delete category"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
