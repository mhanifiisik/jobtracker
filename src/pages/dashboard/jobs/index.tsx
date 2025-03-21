import { useFetchData } from '@/api'
import { JobListing } from '@/types/job-listing'
import { formatDate } from '@/utils/format-date'
import { getStatusColor } from '@/utils/job-status-color'
import { JobStatusLabels } from '@/utils/job-status-mapper'
import { MapPin, Calendar, Clock, Building, Briefcase, ExternalLink, Trash2 } from 'lucide-react'

export default function JobsPage() {
  const { data: jobs, isLoading } = useFetchData<JobListing>('jobs')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Applications Tracker</h1>
      </div>
      {isLoading ? (
        <div className="border-muted-light bg-muted-light flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-dark mb-4 text-lg">No job applications found</p>
          <p className="text-muted text-sm">Add your first job application to start tracking</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs?.map((job) => (
            <div
              key={job.id}
              className="bg-background border-muted-light overflow-hidden rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="border-muted-light border-b p-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-info-light text-info-dark flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border font-semibold">
                    {job.company.split('').slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-muted-dark truncate text-lg font-medium">
                        {job.position}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(job.status)}`}
                      >
                        {JobStatusLabels[job.status]}
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
