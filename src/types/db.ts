import { JobStatus } from '../constants/job-status.enum'
import { QuestionDifficulty } from '../constants/question-difficulty.enum'

export interface JobApplication {
  id: number
  user_id: string
  company_name: string
  position_title: string
  location: string
  status: JobStatus
  date_applied: string
  response_date?: string | null
  created_at: string
  updated_at: string
}

export interface Interview {
  id: number
  application_id: number
  interview_date: string
  interview_type: string
  location: string
  status: string
  notes: string
  created_at: string
  updated_at: string
}

export interface ApplicationNote {
  id: number
  application_id: number
  note: string
  created_at: string
}

export interface Document {
  id: number
  user_id: string
  doc_type: string
  title: string
  file_url: string
  created_at: string
}

export interface Question {
  id: number
  title: string
  difficulty: QuestionDifficulty
  created_at: string
}

export interface UserQuestionProgress {
  user_id: string
  question_id: number
  status: string
  times_solved: number
  last_solved_at?: string | null
  created_at: string
  updated_at: string
}
