import ApplicationCard from '@/components/application-card'
import { MutationType } from '@/constants/mutation-type.enum'
import { useFetchData } from '@/hooks/use-fetch-data'
import { useMutateData } from '@/hooks/use-mutate-data'
import { useSession } from '@/hooks/use-session'
import { useCallback } from 'react'

export default function Applications() {
  const { session } = useSession()
  const { data: applications, isLoading } = useFetchData('job_applications', {
    userId: session?.user.id
  })

  const { mutate: deleteApplication } = useMutateData('job_applications', MutationType.DELETE)

  const handleDelete = useCallback(
    (id: number) => {
      deleteApplication({ id })
    },
    [deleteApplication]
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-foreground text-2xl font-bold">Applications</h1>
      </div>
      {isLoading ? (
        <div className="border-muted bg-background flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4 text-lg">Loading applications...</p>
        </div>
      ) : !applications || applications.length === 0 ? (
        <div className="border-muted bg-background flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4 text-lg">No applications found</p>
          <p className="text-muted-foreground text-sm">
            Add your first application to start tracking
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
