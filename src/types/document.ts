export interface Document {
  id: number;
  user_id: string;
  title: string;
  doc_type: string;
  file_url: string;
  created_at: Date;
  updated_at: Date;
}
