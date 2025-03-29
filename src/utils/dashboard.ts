import type { Application, Interview, Task, Question } from '@/types/database';
import type { StatusChartData } from '@/types/dashboard';
import { STATUS_CHART_COLORS } from '@/constants/dashboard';

export function calculateApplicationStats(applications: Application[] | null) {
  const totalApplications = applications?.length ?? 0;
  const pendingApplications =
    applications?.filter(app => app.status === 'applied' || app.status === 'in interview').length ??
    0;
  const rejectedApplications = applications?.filter(app => app.status === 'rejected').length ?? 0;
  const offeredApplications =
    applications?.filter(app => app.status === 'ready for review').length ?? 0;

  return { totalApplications, pendingApplications, rejectedApplications, offeredApplications };
}

export function calculateInterviewStats(interviews: Interview[] | null) {
  const totalInterviews = interviews?.length ?? 0;
  const upcomingInterviews =
    interviews?.filter(
      interview =>
        interview.status === 'scheduled' && new Date(interview.interview_date) > new Date()
    ).length ?? 0;

  return { totalInterviews, upcomingInterviews };
}

export function calculateTaskStats(tasks: Task[] | null) {
  const totalTasks = tasks?.length ?? 0;
  const completedTasks = tasks?.filter(task => task.status === 'completed').length ?? 0;
  const pendingTasks = tasks?.filter(task => task.status === 'pending').length ?? 0;

  return { totalTasks, completedTasks, pendingTasks };
}

export function calculateQuestionStats(questions: Question[] | null) {
  const totalQuestions = questions?.length ?? 0;
  const solvedQuestions =
    questions?.filter(q => q.difficulty === 'easy' || q.difficulty === 'medium').length ?? 0;
  const hardQuestions = questions?.filter(q => q.difficulty === 'hard').length ?? 0;

  return { totalQuestions, solvedQuestions, hardQuestions };
}

export function getApplicationStatusChartData(
  applications: Application[] | null
): StatusChartData[] {
  return [
    {
      name: 'Applied',
      value: applications?.filter(app => app.status === 'applied').length ?? 0,
      color: STATUS_CHART_COLORS.applied,
    },
    {
      name: 'In Interview',
      value: applications?.filter(app => app.status === 'in interview').length ?? 0,
      color: STATUS_CHART_COLORS.inInterview,
    },
    {
      name: 'Rejected',
      value: applications?.filter(app => app.status === 'rejected').length ?? 0,
      color: STATUS_CHART_COLORS.rejected,
    },
    {
      name: 'Offered',
      value: applications?.filter(app => app.status === 'ready for review').length ?? 0,
      color: STATUS_CHART_COLORS.offered,
    },
  ];
}
