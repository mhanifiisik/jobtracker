import { Send, Building, Award, Code } from 'lucide-react';
import { StatsCard } from './stats-card';
import { useFetchData } from '@/hooks/use-fetch-data';

export function StatsSection() {
  const { data: applications = [] } = useFetchData('job_applications');
  const { data: interviews = [] } = useFetchData('interviews');
  const { data: questions = [] } = useFetchData('questions');
  const { data: questionProgress = [] } = useFetchData('user_question_progress');
  return (
    <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Applications"
        value={applications?.length.toString() ?? '0'}
        trend={{
          value: `${applications?.filter(app => app.status === 'applied').length} pending`,
          label: `${applications?.filter(app => app.status === 'rejected').length} rejected`,
          positive: true,
        }}
        icon={<Send className="h-4 w-4 text-primary" />}
      />

      <StatsCard
        title="Interviews"
        value={interviews?.length.toString() ?? '0'}
        trend={{
          value: `${interviews?.length} upcoming`,
          label: 'scheduled interviews',
          positive: true,
        }}
        icon={<Building className="h-4 w-4 text-accent" />}
      />

      <StatsCard
        title="Response Rate"
        value={`${((interviews?.length ?? 0) / (applications?.length ?? 1)) * 100}%`}
        trend={{
          value: `${interviews?.length} offers`,
          label: 'received',
          positive: true,
        }}
        icon={<Award className="h-4 w-4 text-secondary" />}
      />

      <StatsCard
        title="LeetCode Problems"
        value={`${questionProgress?.filter(progress => progress.status === 'solved').length}/${questions?.length}`}
        icon={<Code className="h-4 w-4 text-primary" />}
      />
    </div>
  );
}
