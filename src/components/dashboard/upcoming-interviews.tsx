import { format } from 'date-fns';
import { useFetchData } from '@/hooks/use-fetch-data';
import { useSession } from '@/hooks/use-session';
import { Video, Phone, Building2, Plus } from 'lucide-react';
import type { Database } from '@/types/database';

type Interview = Database['public']['Tables']['interviews']['Row'];
type InterviewType = Interview['interview_type'];

const formatInterviewDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
};

const getInterviewTypeIcon = (type: InterviewType) => {
  switch (type.toLowerCase()) {
    case 'video':
      return <Video className="h-4 w-4" />;
    case 'phone':
      return <Phone className="h-4 w-4" />;
    default:
      return <Building2 className="h-4 w-4" />;
  }
};

export default function UpcomingInterviews() {
  const { session } = useSession();
  const userId = session?.user.id;

  const { data: interviewsData } = useFetchData('interviews', {
    select: `id,
      job_applications (company_name, position_title),
      interview_date,
      interview_type,
      location,
      status`,
    userId,
    orderBy: 'interview_date',
    order: 'asc',
    filters: [
      {
        column: 'interview_date',
        value: new Date().toLocaleString(),
        operator: 'gt',
      },
    ],
  });

  return (
    <div className="border-border overflow-hidden rounded-lg border bg-card">
      <button
        type="button"
        className="text-primary hover:text-primary/80 flex w-full items-center gap-1 border-b border-border p-4 text-sm font-medium"
      >
        <Plus className="h-4 w-4" />
        Schedule New Interview
      </button>
      <div className="divide-border divide-y">
        {interviewsData && interviewsData.length > 0 ? (
          interviewsData.map(interview => (
            <div
              key={interview.id}
              className="cursor-pointer p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-foreground">
                    {interview.job_applications?.company_name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {interview.job_applications?.position_title}
                  </p>
                </div>
                <div className="text-muted-foreground flex items-center gap-2">
                  {getInterviewTypeIcon(interview.interview_type)}
                  <span className="text-xs capitalize">
                    {interview.interview_type.toLowerCase()}
                  </span>
                </div>
              </div>

              <div className="text-muted-foreground mt-3 flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <time dateTime={interview.interview_date}>
                    {formatInterviewDate(interview.interview_date)}
                  </time>
                </div>
                {interview.location && (
                  <>
                    <span>•</span>
                    <span>{interview.location}</span>
                  </>
                )}
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 capitalize">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        interview.status === 'scheduled'
                          ? 'bg-primary dark:bg-primary/90'
                          : interview.status === 'completed'
                            ? 'bg-accent dark:bg-accent/90'
                            : 'bg-secondary dark:bg-secondary/90'
                      }`}
                    />
                    {interview.status.toLowerCase()}
                  </span>
                </>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground p-8 text-center">
            <Building2 className="mx-auto mb-3 h-8 w-8 opacity-50" />
            <p className="text-sm font-medium">No upcoming interviews</p>
            <p className="mt-1 text-xs">Schedule your next interview to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}
