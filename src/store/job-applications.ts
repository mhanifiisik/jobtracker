import type { JobApplication } from '@/types/db-tables';
import supabase from '@/utils/supabase';
import { create } from 'zustand';
import { useAuthStore } from './auth';
import type { TablesUpdate, TablesInsert } from '@/types/database';
import { useErrorStore } from './error-handler';
import toast from 'react-hot-toast';
import type { JobStatus } from '@/constants/job-statuses.constant';

interface JobApplicationsState {
  jobApplications: JobApplication[];
  isLoading: boolean;
  error: string | null;
  fetchJobApplications: () => Promise<void>;
  createJobApplication: (jobApplication: TablesInsert<'job_applications'>) => Promise<void>;
  updateJobApplication: (
    id: number,
    jobApplication: TablesUpdate<'job_applications'>
  ) => Promise<void>;
  deleteJobApplication: (id: number) => Promise<void>;
  createOrUpdateJobApplicationFromJob: (jobId: number, status: JobStatus) => Promise<void>;
}

export const useJobApplicationsStore = create<JobApplicationsState>(set => ({
  jobApplications: [],
  isLoading: false,
  error: null,
  fetchJobApplications: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.from('job_applications').select('*');
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set({ isLoading: false, jobApplications: data });
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to fetch job applications'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch job applications',
      });
    }
  },
  createJobApplication: async (jobApplication: TablesInsert<'job_applications'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const jobApplicationWithUserId = { ...jobApplication, user_id: user.id };
      const { data, error } = await supabase
        .from('job_applications')
        .insert(jobApplicationWithUserId)
        .select();
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          jobApplications: [...state.jobApplications, ...data],
        }));
        toast.success('Job application created successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to create job application'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create job application',
      });
    }
  },
  updateJobApplication: async (id: number, jobApplication: TablesUpdate<'job_applications'>) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { data, error } = await supabase
        .from('job_applications')
        .update(jobApplication)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          jobApplications: state.jobApplications.map(j => (j.id === id ? data[0] : j)),
        }));
        toast.success('Job application updated successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to update job application'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update job application',
      });
    }
  },
  deleteJobApplication: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) {
        useErrorStore.getState().showError(error);
        set({ isLoading: false, error: error.message });
      } else {
        set(state => ({
          isLoading: false,
          jobApplications: state.jobApplications.filter(job => job.id !== id),
        }));
        toast.success('Job application deleted successfully');
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to delete job application'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete job application',
      });
    }
  },
  createOrUpdateJobApplicationFromJob: async (jobId: number, status: JobStatus) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) {
        useErrorStore.getState().showError(new Error('User not authenticated'));
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }

      // First, get the job details
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError) {
        useErrorStore.getState().showError(jobError);
        set({ isLoading: false, error: jobError.message });
        return;
      }

      // Check if a job application already exists for this job
      const { data: existingApp, error: existingError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId)
        .eq('user_id', user.id)
        .single();

      if (existingError && existingError.code !== 'PGRST116') {
        // PGRST116 is the error code for "no rows returned" which is fine
        useErrorStore.getState().showError(existingError);
        set({ isLoading: false, error: existingError.message });
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      if (existingApp) {
        // Update existing job application
        const { error: updateError } = await supabase
          .from('job_applications')
          .update({
            status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingApp.id)
          .eq('user_id', user.id);

        if (updateError) {
          useErrorStore.getState().showError(updateError);
          set({ isLoading: false, error: updateError.message });
        } else {
          set(state => ({
            isLoading: false,
            jobApplications: state.jobApplications.map(j =>
              j.id === existingApp.id ? { ...j, status, updated_at: new Date().toISOString() } : j
            ),
          }));
        }
      } else {
        // Create new job application
        const newJobApplication: TablesInsert<'job_applications'> = {
          job_id: jobId,
          position_title: jobData.position,
          company_name: jobData.company,
          location: jobData.location ?? '',
          date_applied: today,
          status,
          user_id: user.id,
        };

        const { data, error: insertError } = await supabase
          .from('job_applications')
          .insert(newJobApplication)
          .select();

        if (insertError) {
          useErrorStore.getState().showError(insertError);
          set({ isLoading: false, error: insertError.message });
        } else {
          set(state => ({
            isLoading: false,
            jobApplications: [...state.jobApplications, ...data],
          }));
        }
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(error instanceof Error ? error : new Error('Failed to update job application'));
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update job application',
      });
    }
  },
}));
