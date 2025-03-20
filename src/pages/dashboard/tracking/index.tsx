import { useState, useEffect } from 'react'
import supabase from '../../../utils/supabase'
import { JobListing } from '../../../types/job-listing'
import {
  MapPin,
  Calendar,
  Clock,
  Building,
  Briefcase,
  ExternalLink,
  Trash2,
  Filter,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import { JobStatus } from '../../../constants/job-status.enum'

function TrackingPage() {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      let query = supabase.from('jobs').select('*')

      if (filterStatus) {
        query = query.eq('status', filterStatus)
      }

      const { data: jobs, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      setJobs(jobs)
      setError(null)
    } catch (error) {
      setError(error.message as string)
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (id: number) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        const { error } = await supabase.from('jobs').delete().eq('id', id)

        if (error) {
          throw new Error(error.message)
        }

        setJobs(jobs.filter((job) => job.id !== id))
      } catch (error) {
        setError(error.message as string)
      }
    }
  }

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.New:
        return 'bg-primary text-primary-dark'
      case JobStatus.ReadyForReview:
        return 'bg-warning text-warning-dark'
      case JobStatus.Applied:
        return 'bg-info text-info-dark'
      case JobStatus.InInterview:
        return 'bg-secondary text-secondary-dark'
      case JobStatus.OnWishlist:
        return 'bg-success text-success-dark'
      case JobStatus.Rejected:
        return 'bg-danger text-danger-dark'
      default:
        return 'bg-muted text-muted-dark'
    }
  }

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getCompanyInitials = (company: string) => {
    return company
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Applications Tracker</h1>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              className="bg-background border-muted-light focus:border-primary focus:ring-primary h-10 rounded-md border pr-10 pl-3 text-sm focus:ring-1 focus:outline-none"
              value={filterStatus ?? ''}
              onChange={(e) => setFilterStatus(e.target.value || null)}
            >
              <option value="">All Statuses</option>
              {Object.values(JobStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <Filter className="text-muted pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
          </div>

          <button
            type="button"
            onClick={fetchJobs}
            className="bg-background border-muted-light text-muted-dark hover:bg-muted-light inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium shadow-sm"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-danger-light text-danger-dark mb-6 flex items-center rounded-md p-4">
          <AlertTriangle className="mr-2 h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="border-info h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="border-muted-light bg-muted-light flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-dark mb-4 text-lg">No job applications found</p>
          <p className="text-muted text-sm">Add your first job application to start tracking</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-background border-muted-light overflow-hidden rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="border-muted-light border-b p-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-info-light text-info-dark flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-semibold">
                    {getCompanyInitials(job.company)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-muted-dark truncate text-lg font-medium">
                        {job.position}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(job.status)}`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <p className="text-muted mt-1 flex items-center text-sm">
                      <Building className="mr-1.5 h-4 w-4 flex-shrink-0" />
                      {job.company}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-muted-light border-b p-4">
                <p className="text-muted-dark line-clamp-3 text-sm">
                  {job.description || 'No description available.'}
                </p>
              </div>

              <div className="border-muted-light bg-muted-light grid grid-cols-2 gap-x-4 gap-y-2 border-b p-4 text-sm">
                <div className="text-muted-dark flex items-center">
                  <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{job.location || 'Remote'}</span>
                </div>

                <div className="text-muted-dark flex items-center">
                  <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{formatDate(job.published_date)}</span>
                </div>

                <div className="text-muted-dark flex items-center">
                  <Clock className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Applied: {formatDate(job.created_at)}</span>
                </div>

                <div className="text-muted-dark flex items-center">
                  <Briefcase className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Updated: {formatDate(job.updated_at)}</span>
                </div>
              </div>

              <div className="divide-muted-light flex divide-x">
                <button
                  type="button"
                  className="text-info-dark hover:bg-info-light flex flex-1 items-center justify-center p-3 text-sm font-medium transition-colors hover:cursor-pointer"
                >
                  <ExternalLink className="mr-1.5 h-4 w-4" />
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => deleteJob(job.id)}
                  className="text-danger-dark hover:bg-danger-light flex flex-1 items-center justify-center p-3 text-sm font-medium transition-colors hover:cursor-pointer"
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TrackingPage
