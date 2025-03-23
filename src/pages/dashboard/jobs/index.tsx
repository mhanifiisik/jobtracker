import JobCard from '@/components/job-card'
import { useFetchData } from '@/hooks/use-fetch-data'
import { useMutateData } from '@/hooks/use-mutate-data'
import { useCallback } from 'react'
import { MutationType } from '@/constants/mutation-type.enum'

export default function JobsPage() {
  const { data: jobs, isLoading } = useFetchData('jobs', {})

  const { mutate: deleteJob } = useMutateData('jobs', MutationType.DELETE)

  const handleDelete = useCallback(
    (id: number) => {
      deleteJob({ id })
    },
    [deleteJob]
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-foreground text-2xl font-bold">Job Applications Tracker</h1>
      </div>
      {isLoading ? (
        <div className="border-muted bg-background flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4 text-lg">Loading jobs...</p>
        </div>
      ) : !jobs || jobs.length === 0 ? (
        <div className="border-muted bg-background flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4 text-lg">No job applications found</p>
          <p className="text-muted-foreground text-sm">
            Add your first job application to start tracking
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
