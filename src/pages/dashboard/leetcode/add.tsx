import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { QuestionForm } from '@/components/forms/question-form';



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