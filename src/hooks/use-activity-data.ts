import supabase from '@/utils/supabase';
import { useQuery } from '@tanstack/react-query';
import { startOfYear, endOfYear, parseISO } from 'date-fns';
import type { Database } from '@/types/database';

type JobApplication = Database['public']['Tables']['job_applications']['Row'];
type Interview = Database['public']['Tables']['interviews']['Row'];
type StudySession = Database['public']['Tables']['study_session']['Row'];
type Question = Database['public']['Tables']['questions']['Row'];

interface ActivityData {
  date: Date;
  level: number;
  type: 'application' | 'interview' | 'study' | 'question';
  details: string;
}

const fetchActivityData = async (): Promise<ActivityData[]> => {
  const startDate = startOfYear(new Date());
  const endDate = endOfYear(new Date());

  // Fetch job applications
  const { data: applications } = await supabase
    .from('job_applications')
    .select('*')
    .gte('date_applied', startDate.toISOString())
    .lte('date_applied', endDate.toISOString());

  // Fetch interviews
  const { data: interviews } = await supabase
    .from('interviews')
    .select('*')
    .gte('interview_date', startDate.toISOString())
    .lte('interview_date', endDate.toISOString());

  // Fetch study sessions
  const { data: studySessions } = await supabase
    .from('study_session')
    .select('*')
    .gte('start_time', startDate.toISOString())
    .lte('start_time', endDate.toISOString());

  // Fetch questions solved
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  const activityData: ActivityData[] = [];

  // Add job applications
  applications?.forEach((app: JobApplication) => {
    if (app.date_applied) {
      activityData.push({
        date: parseISO(app.date_applied),
        level: 3, // High activity level for applications
        type: 'application',
        details: `Applied to ${app.position_title} at ${app.company_name}`,
      });
    }
  });

  // Add interviews
  interviews?.forEach((interview: Interview) => {
    if (interview.interview_date) {
      activityData.push({
        date: parseISO(interview.interview_date),
        level: 4, // Very high activity level for interviews
        type: 'interview',
        details: `Interview at ${interview.location}`,
      });
    }
  });

  // Add study sessions
  studySessions?.forEach((session: StudySession) => {
    if (session.start_time) {
      activityData.push({
        date: parseISO(session.start_time),
        level: 2, // Medium activity level for study sessions
        type: 'study',
        details: `Study session: ${session.questions_solved} questions solved`,
      });
    }
  });

  // Add questions solved
  questions?.forEach((question: Question) => {
    if (question.created_at) {
      activityData.push({
        date: parseISO(question.created_at),
        level: 1, // Low activity level for individual questions
        type: 'question',
        details: `Solved: ${question.title}`,
      });
    }
  });

  // Sort by date
  return activityData.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const useActivityData = () => {
  return useQuery({
    queryKey: ['activity-data'],
    queryFn: fetchActivityData,
  });
};
