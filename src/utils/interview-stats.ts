import type { Interview } from '@/types/database';

export function calculateInterviewStats(interviews: Interview[] | null) {
  const totalInterviews = interviews?.length ?? 0;
  const upcomingInterviews =
    interviews?.filter(
      interview =>
        interview.status === 'scheduled' && new Date(interview.interview_date) > new Date()
    ).length ?? 0;

  return { totalInterviews, upcomingInterviews };
}
