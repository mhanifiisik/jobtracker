import { JobStatus } from '@/constants/job-status.enum'

export interface JobListing {
  id: number
  company: string
  position: string
  location: string
  description: string
  published_date: Date
  scraped_date: Date
  created_at: Date
  updated_at: Date
  status: JobStatus
}
