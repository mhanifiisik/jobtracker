import { Send, Building, Award, Code } from 'lucide-react';
import { StatsCard } from './stats-card';
import { useApplicationsStore } from '@/store/applications';
import { useQuestionsStore } from '@/store/questions';
import { useProgressStore } from '@/store/progress';
import { useInterviewsStore } from '@/store/interviews';
import { useEffect } from 'react';

export function StatsSection() {
  const { applications , fetchApplications } = useApplicationsStore();
  const { interviews, fetchInterviews } = useInterviewsStore();
  const { questions, fetchQuestions } = useQuestionsStore();
  const { progress, fetchProgress } = useProgressStore();

  useEffect(() => {
    void fetchApplications();
    void fetchInterviews();
    void fetchQuestions();
    void fetchProgress();
  }, [fetchApplications, fetchInterviews, fetchQuestions, fetchProgress]);

  return (
    <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Applications"
        value={applications.length.toString()}
        trend={{
          value: `${applications.filter(app => app.status === 'applied').length} pending`,
          label: `${applications.filter(app => app.status === 'rejected').length} rejected`,
          positive: true,
        }}
        icon={<Send className="h-4 w-4 text-primary" />}
      />

      <StatsCard
        title="Interviews"
        value={interviews.length.toString()}
        trend={{
          value: `${interviews.length} upcoming`,
          label: 'scheduled interviews',
          positive: true,
        }}
        icon={<Building className="h-4 w-4 text-accent" />}
      />

      <StatsCard
        title="Response Rate"
        value={`${((interviews.length / applications.length) * 100)}%`}
        trend={{
          value: `${interviews.length} offers`,
          label: 'received',
          positive: true,
        }}
        icon={<Award className="h-4 w-4 text-secondary" />}
      />

      <StatsCard
        title="LeetCode Problems"
        value={`${progress.filter(progress => progress.status === 'solved').length}/${questions.length}`}
        icon={<Code className="h-4 w-4 text-primary" />}
      />
    </div>
  );
}
