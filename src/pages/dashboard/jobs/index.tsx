import JobCard from '@/components/job-card';
import { Search, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import { useState, useEffect, useMemo } from 'react';
import { useJobsStore } from '@/store/jobs';
import { JOB_STATUSES } from '@/constants/job-statuses.constant';
import type { Job } from '@/types/db-tables';

export default function JobsPage() {

  const { jobs, fetchJobs,deleteJob, isLoading, updateJob } = useJobsStore();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');



  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  const handleStatusChange = async (jobId: number, status:Job['status']) => {
    try {
      await updateJob(jobId, { status });
      toast.success('Job status updated successfully');
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    }
  };

  const handleDelete = async (jobId: number) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(jobId);
        toast.success('Job deleted successfully');
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error('Failed to delete job');
      }
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job =>
      job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [jobs, searchQuery]);

  const sortedJobs = useMemo(() => {
    return filteredJobs.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at ?? '').getTime() - new Date(a.created_at ?? '').getTime();
      }
      return (a.status ?? '').localeCompare(b.status ?? '');
    });
  }, [filteredJobs, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground text-3xl font-bold mb-2">Job Applications Tracker</h1>
        <p className="text-muted-foreground">Import and manage your job applications from CSV files</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search jobs by title or company..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background"
            value={searchQuery}
            onChange={(e) => {setSearchQuery(e.target.value)}}
          />
        </div>

        <div className="flex gap-2">
          <select
            className="px-4 py-2 rounded-md border border-input bg-background"
            value={sortBy}
            onChange={(e) => {setSortBy(e.target.value as 'date' | 'status')}}
          >
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
          </select>

          <Link to="/dashboard/jobs/import">
            <button type="button" className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors">
              <Upload size={20} />
              Import CSV
            </button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="border-muted bg-background flex h-96 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading your job applications...</p>
        </div>
      ) : sortedJobs.length === 0 ? (
        <div className="border-muted bg-background flex h-96 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="bg-muted rounded-full p-4 mb-4">
            <Upload size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-lg mb-2">No job applications found</p>
          <p className="text-muted-foreground text-sm mb-6">
            {searchQuery
              ? "No jobs match your search criteria"
              : "Import your job applications from a CSV file to get started"}
          </p>
          <Link to="/dashboard/jobs/import">
            <button type="button" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Import Your First Job
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={() => handleDelete(job.id)}
              onStatusChange={handleStatusChange}
              statusOptions={JOB_STATUSES.map(status => ({ value: status, label: status }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
