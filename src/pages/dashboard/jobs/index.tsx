import JobCard from '@/components/job-card';
import { Search, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import { useState, useEffect, useMemo } from 'react';
import { useJobsStore } from '@/store/jobs';
import { JOB_STATUSES } from '@/constants/job-statuses.constant';
import type { Job } from '@/types/db-tables';
import { fetchJustJoinJobs, type JobData as JustJoinJob } from '@/utils/fetch-jobs';

function JobsPage() {
  const { jobs, deleteJob, isLoading, updateJob } = useJobsStore();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [justJoinJobs, setJustJoinJobs] = useState<JustJoinJob[]>([]);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const jobs = await fetchJustJoinJobs();
        setJustJoinJobs(jobs);
        setTotalJobs(jobs.length);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to fetch jobs');
      } finally {
        setIsLoadingJobs(false);
      }
    };

    void fetchJobs();
  }, []);

  const handleStatusChange = async (jobId: number, status: Job['status']) => {
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
    return jobs.filter(
      job =>
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
    <div className="w-full">
      <main className="mx-auto max-w-[100rem] px-6 py-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-bold">Job Applications Tracker</h1>
          <p className="text-muted-foreground">
            Import and manage your job applications from CSV files
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground text-2xl font-semibold">JustJoin.it Jobs</h2>
            <span className="text-muted-foreground text-sm">
              Found {totalJobs.toLocaleString()} jobs
            </span>
          </div>

          {isLoadingJobs ? (
            <div className="border-muted bg-background flex h-96 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <div className="border-primary mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground text-lg">Loading jobs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {justJoinJobs.map(job => (
                <div
                  key={job.data_index}
                  className="border-muted bg-background rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-center gap-4">
                    {job.company_logo && job.company_logo !== 'N/A' && (
                      <img
                        src={job.company_logo}
                        alt={`${job.company} logo`}
                        className="h-12 w-12 rounded-full object-contain"
                      />
                    )}
                    <div>
                      <h3 className="text-foreground font-medium">{job.title}</h3>
                      <p className="text-muted-foreground text-sm">{job.company}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
                      <span>{job.location}</span>
                      {job.remote_status.toLowerCase().includes('remote') && (
                        <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                          Remote
                        </span>
                      )}
                    </div>
                    {job.salary && job.salary !== 'N/A' && (
                      <div className="text-muted-foreground text-sm">{job.salary}</div>
                    )}
                    {job.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.skills.map(skill => (
                          <span
                            key={skill}
                            className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary hover:bg-primary/90 flex-1 rounded-md px-4 py-2 text-center text-sm text-white transition-colors"
                    >
                      Apply on JustJoin.it
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform"
              size={20}
            />
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              className="border-input bg-background w-full rounded-md border py-2 pr-4 pl-10"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="border-input bg-background rounded-md border px-4 py-2"
              value={sortBy}
              onChange={e => {
                setSortBy(e.target.value as 'date' | 'status');
              }}
            >
              <option value="date">Sort by Date</option>
              <option value="status">Sort by Status</option>
            </select>

            <Link to="/dashboard/jobs/import">
              <button
                type="button"
                className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-md px-4 py-2 text-white transition-colors"
              >
                <Upload size={20} />
                Import CSV
              </button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="border-muted bg-background flex h-96 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <div className="border-primary mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
            <p className="text-muted-foreground text-lg">Loading your job applications...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-foreground mb-4 text-2xl font-semibold">Your Job Applications</h2>
            {sortedJobs.length === 0 ? (
              <div className="border-muted bg-background flex h-96 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <div className="bg-muted mb-4 rounded-full p-4">
                  <Upload size={32} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-2 text-lg">No job applications found</p>
                <p className="text-muted-foreground mb-6 text-sm">
                  {searchQuery
                    ? 'No jobs match your search criteria'
                    : 'Import your job applications from a CSV file to get started'}
                </p>
                <Link to="/dashboard/jobs/import">
                  <button
                    type="button"
                    className="bg-primary hover:bg-primary/90 rounded-md px-6 py-2 text-white transition-colors"
                  >
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
        )}
      </main>
    </div>
  );
}

export default JobsPage;
