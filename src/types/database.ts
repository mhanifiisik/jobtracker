/* eslint-disable */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      application_notes: {
        Row: {
          application_id: number | null;
          created_at: string | null;
          id: number;
          note: string;
          user_id: string;
        };
        Insert: {
          application_id?: number | null;
          created_at?: string | null;
          id?: never;
          note: string;
          user_id: string;
        };
        Update: {
          application_id?: number | null;
          created_at?: string | null;
          id?: never;
          note?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'application_notes_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: false;
            referencedRelation: 'job_applications';
            referencedColumns: ['id'];
          },
        ];
      };
      documents: {
        Row: {
          content: string | null;
          created_at: string | null;
          doc_type: string;
          id: number;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          doc_type: string;
          id?: never;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          doc_type?: string;
          id?: never;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      interviews: {
        Row: {
          application_id: number | null;
          created_at: string | null;
          id: number;
          interview_date: string;
          interview_type: Database['public']['Enums']['interview_type_enum'];
          location: string;
          notes: string | null;
          status: Database['public']['Enums']['interview_status_enum'];
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          application_id?: number | null;
          created_at?: string | null;
          id?: never;
          interview_date: string;
          interview_type?: Database['public']['Enums']['interview_type_enum'];
          location: string;
          notes?: string | null;
          status: Database['public']['Enums']['interview_status_enum'];
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          application_id?: number | null;
          created_at?: string | null;
          id?: never;
          interview_date?: string;
          interview_type?: Database['public']['Enums']['interview_type_enum'];
          location?: string;
          notes?: string | null;
          status?: Database['public']['Enums']['interview_status_enum'];
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'interviews_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: false;
            referencedRelation: 'job_applications';
            referencedColumns: ['id'];
          },
        ];
      };
      job_applications: {
        Row: {
          company_name: string;
          created_at: string | null;
          date_applied: string;
          id: number;
          job_id: number | null;
          location: string;
          position_title: string;
          response_date: string | null;
          status: Database['public']['Enums']['job_status'];
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          company_name: string;
          created_at?: string | null;
          date_applied: string;
          id?: never;
          job_id?: number | null;
          location: string;
          position_title: string;
          response_date?: string | null;
          status?: Database['public']['Enums']['job_status'];
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          company_name?: string;
          created_at?: string | null;
          date_applied?: string;
          id?: never;
          job_id?: number | null;
          location?: string;
          position_title?: string;
          response_date?: string | null;
          status?: Database['public']['Enums']['job_status'];
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'job_applications_job_id_fkey';
            columns: ['job_id'];
            isOneToOne: false;
            referencedRelation: 'jobs';
            referencedColumns: ['id'];
          },
        ];
      };
      jobs: {
        Row: {
          company: string;
          created_at: string | null;
          description: string | null;
          id: number;
          location: string | null;
          position: string;
          published_date: string | null;
          scraped_date: string | null;
          source_url: string | null;
          status: Database['public']['Enums']['job_status'] | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          company: string;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          location?: string | null;
          position: string;
          published_date?: string | null;
          scraped_date?: string | null;
          source_url?: string | null;
          status?: Database['public']['Enums']['job_status'] | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          company?: string;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          location?: string | null;
          position?: string;
          published_date?: string | null;
          scraped_date?: string | null;
          source_url?: string | null;
          status?: Database['public']['Enums']['job_status'] | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      question_categories: {
        Row: {
          created_at: string | null;
          id: number;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          category_id: number | null;
          created_at: string | null;
          difficulty: Database['public']['Enums']['difficulty_enum'] | null;
          id: number;
          notes: string | null;
          title: string;
          url: string | null;
          user_id: string;
        };
        Insert: {
          category_id?: number | null;
          created_at?: string | null;
          difficulty?: Database['public']['Enums']['difficulty_enum'] | null;
          id?: number;
          notes?: string | null;
          title: string;
          url?: string | null;
          user_id: string;
        };
        Update: {
          category_id?: number | null;
          created_at?: string | null;
          difficulty?: Database['public']['Enums']['difficulty_enum'] | null;
          id?: number;
          notes?: string | null;
          title?: string;
          url?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'questions_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'question_categories';
            referencedColumns: ['id'];
          },
        ];
      };
      study_plan: {
        Row: {
          categories: string[];
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          goal_questions_per_day: number | null;
          id: number;
          progress: number | null;
          start_date: string | null;
          title: string | null;
          user_id: string;
        };
        Insert: {
          categories: string[];
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          goal_questions_per_day?: number | null;
          id?: never;
          progress?: number | null;
          start_date?: string | null;
          title?: string | null;
          user_id: string;
        };
        Update: {
          categories?: string[];
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          goal_questions_per_day?: number | null;
          id?: never;
          progress?: number | null;
          start_date?: string | null;
          title?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      study_plan_questions: {
        Row: {
          id: string;
          question_id: number;
          study_plan_id: number;
        };
        Insert: {
          id?: string;
          question_id: number;
          study_plan_id: number;
        };
        Update: {
          id?: string;
          question_id?: number;
          study_plan_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_question';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fk_study_plan';
            columns: ['study_plan_id'];
            isOneToOne: false;
            referencedRelation: 'study_plan';
            referencedColumns: ['id'];
          },
        ];
      };
      study_session: {
        Row: {
          created_at: string | null;
          end_time: string | null;
          id: number;
          mood: Database['public']['Enums']['mod_status'] | null;
          notes: string | null;
          questions_solved: number | null;
          start_time: string | null;
          study_plan_id: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          end_time?: string | null;
          id?: never;
          mood?: Database['public']['Enums']['mod_status'] | null;
          notes?: string | null;
          questions_solved?: number | null;
          start_time?: string | null;
          study_plan_id?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          end_time?: string | null;
          id?: never;
          mood?: Database['public']['Enums']['mod_status'] | null;
          notes?: string | null;
          questions_solved?: number | null;
          start_time?: string | null;
          study_plan_id?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'study_session_study_plan_id_fkey';
            columns: ['study_plan_id'];
            isOneToOne: false;
            referencedRelation: 'study_plan';
            referencedColumns: ['id'];
          },
        ];
      };
      tasks: {
        Row: {
          created_at: string | null;
          id: number;
          status: Database['public']['Enums']['status_enum'];
          task_name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: never;
          status: Database['public']['Enums']['status_enum'];
          task_name: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: never;
          status?: Database['public']['Enums']['status_enum'];
          task_name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_question_progress: {
        Row: {
          created_at: string | null;
          last_solved_at: string | null;
          question_id: number;
          status: Database['public']['Enums']['user_question_progress_status_enum'] | null;
          times_solved: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          last_solved_at?: string | null;
          question_id: number;
          status?: Database['public']['Enums']['user_question_progress_status_enum'] | null;
          times_solved?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          last_solved_at?: string | null;
          question_id?: number;
          status?: Database['public']['Enums']['user_question_progress_status_enum'] | null;
          times_solved?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_question_progress_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      difficulty_enum: 'easy' | 'medium' | 'hard';
      interview_status_enum: 'scheduled' | 'completed' | 'canceled';
      interview_type_enum: 'phone' | 'in-person' | 'video';
      job_application_status_enum: 'applied' | 'in interview' | 'offer' | 'rejected' | 'wishlist';
      job_status:
        | 'new'
        | 'applied'
        | 'saved'
        | 'interviewing'
        | 'offered'
        | 'rejected'
        | 'archived'
        | 'withdrawn';
      mod_status: 'productive' | 'neutral' | 'struggling';
      progress_status: 'new' | 'learning' | 'reviewing' | 'mastered';
      status_enum: 'pending' | 'in progress' | 'completed' | 'cancelled';
      user_question_progress_status_enum: 'solved' | 'attempted' | 'not started';
    };
    CompositeTypes: Record<never, never>;
  };
}

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
