import { Link } from 'react-router';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Loader from '@/components/ui/loading';
import toast from 'react-hot-toast';
import { CategoryForm } from '@/components/forms/categories-form';
import { useQuestionsStore } from '@/store/questions';



const CategoriesPage = () => {

  const { categories, isLoading, deleteCategory } = useQuestionsStore();



  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategory(Number(categoryId));
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
              <div className="space-y-4">
                {categories.map(category => (
                  <div
                    key={category.id}
                    className="border-border flex items-center justify-between rounded-lg border p-4"
                  >
                    <span className="text-foreground">{category.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(category.id.toString())}
                      className="text-destructive hover:text-destructive/90 flex items-center gap-1 rounded px-3 py-1 text-sm transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;