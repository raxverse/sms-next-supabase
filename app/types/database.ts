export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          attendance_date: string
          id: string
          school_id: string
          session_class_section_id: string
          status: string
          student_id: string
        }
        Insert: {
          attendance_date: string
          id?: string
          school_id: string
          session_class_section_id: string
          status: string
          student_id: string
        }
        Update: {
          attendance_date?: string
          id?: string
          school_id?: string
          session_class_section_id?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_session_class_section_id_fkey"
            columns: ["session_class_section_id"]
            isOneToOne: false
            referencedRelation: "session_class_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string | null
          id: string
          level: number | null
          name: string
          school_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          level?: number | null
          name: string
          school_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number | null
          name?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_types: {
        Row: {
          id: string
          name: string
          school_id: string
        }
        Insert: {
          id?: string
          name: string
          school_id: string
        }
        Update: {
          id?: string
          name?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_types_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          end_date: string | null
          exam_type_id: string
          id: string
          school_id: string
          session_id: string
          start_date: string | null
        }
        Insert: {
          end_date?: string | null
          exam_type_id: string
          id?: string
          school_id: string
          session_id: string
          start_date?: string | null
        }
        Update: {
          end_date?: string | null
          exam_type_id?: string
          id?: string
          school_id?: string
          session_id?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exams_exam_type_id_fkey"
            columns: ["exam_type_id"]
            isOneToOne: false
            referencedRelation: "exam_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_payments: {
        Row: {
          amount_paid: number
          id: string
          invoice_id: string
          payment_date: string | null
          payment_mode: string
          school_id: string
          transaction_id: string | null
        }
        Insert: {
          amount_paid: number
          id?: string
          invoice_id: string
          payment_date?: string | null
          payment_mode: string
          school_id: string
          transaction_id?: string | null
        }
        Update: {
          amount_paid?: number
          id?: string
          invoice_id?: string
          payment_date?: string | null
          payment_mode?: string
          school_id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "student_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structures: {
        Row: {
          amount: number
          class_id: string
          fee_type_id: string
          frequency: string | null
          id: string
          school_id: string
          session_id: string
        }
        Insert: {
          amount: number
          class_id: string
          fee_type_id: string
          frequency?: string | null
          id?: string
          school_id: string
          session_id: string
        }
        Update: {
          amount?: number
          class_id?: string
          fee_type_id?: string
          frequency?: string | null
          id?: string
          school_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_structures_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_structures_fee_type_id_fkey"
            columns: ["fee_type_id"]
            isOneToOne: false
            referencedRelation: "fee_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_structures_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_structures_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_types: {
        Row: {
          description: string | null
          id: string
          name: string
          school_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          school_id: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_types_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      guardians: {
        Row: {
          address: string | null
          created_at: string | null
          father_name: string | null
          id: string
          mother_name: string | null
          primary_phone: string
          profile_id: string | null
          school_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          father_name?: string | null
          id?: string
          mother_name?: string | null
          primary_phone: string
          profile_id?: string | null
          school_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          father_name?: string | null
          id?: string
          mother_name?: string | null
          primary_phone?: string
          profile_id?: string | null
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardians_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guardians_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      marks: {
        Row: {
          exam_id: string
          id: string
          marks_obtained: number | null
          max_marks: number
          school_id: string
          student_id: string
          subject_id: string
        }
        Insert: {
          exam_id: string
          id?: string
          marks_obtained?: number | null
          max_marks: number
          school_id: string
          student_id: string
          subject_id: string
        }
        Update: {
          exam_id?: string
          id?: string
          marks_obtained?: number | null
          max_marks?: number
          school_id?: string
          student_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marks_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marks_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string | null
          role_id: number | null
          school_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id: string
          is_active?: boolean | null
          last_name?: string | null
          role_id?: number | null
          school_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          role_id?: number | null
          school_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          role_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          role_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          role_name?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          slug: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          slug: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          slug?: string
        }
        Relationships: []
      }
      sections: {
        Row: {
          created_at: string | null
          id: string
          name: string
          school_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          school_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      session_class_sections: {
        Row: {
          class_id: string
          class_teacher_id: string | null
          id: string
          school_id: string
          section_id: string
          session_id: string
        }
        Insert: {
          class_id: string
          class_teacher_id?: string | null
          id?: string
          school_id: string
          section_id: string
          session_id: string
        }
        Update: {
          class_id?: string
          class_teacher_id?: string | null
          id?: string
          school_id?: string
          section_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_class_sections_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_class_sections_class_teacher_id_fkey"
            columns: ["class_teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_class_sections_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_class_sections_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_class_sections_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          is_current: boolean | null
          school_id: string
          session_name: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          is_current?: boolean | null
          school_id: string
          session_name: string
          start_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          is_current?: boolean | null
          school_id?: string
          session_name?: string
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      student_enrollments: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          roll_number: number | null
          school_id: string
          session_class_section_id: string
          student_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          roll_number?: number | null
          school_id: string
          session_class_section_id: string
          student_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          roll_number?: number | null
          school_id?: string
          session_class_section_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_enrollments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_enrollments_session_class_section_id_fkey"
            columns: ["session_class_section_id"]
            isOneToOne: false
            referencedRelation: "session_class_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_invoices: {
        Row: {
          created_at: string | null
          due_date: string
          id: string
          invoice_month: string
          school_id: string
          session_id: string
          status: string | null
          student_id: string
          total_amount: number
        }
        Insert: {
          created_at?: string | null
          due_date: string
          id?: string
          invoice_month: string
          school_id: string
          session_id: string
          status?: string | null
          student_id: string
          total_amount: number
        }
        Update: {
          created_at?: string | null
          due_date?: string
          id?: string
          invoice_month?: string
          school_id?: string
          session_id?: string
          status?: string | null
          student_id?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_invoices_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_invoices_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          admission_number: string
          created_at: string | null
          dob: string
          first_name: string
          gender: string | null
          guardian_id: string | null
          id: string
          last_name: string | null
          school_id: string
          status: string | null
        }
        Insert: {
          admission_number: string
          created_at?: string | null
          dob: string
          first_name: string
          gender?: string | null
          guardian_id?: string | null
          id?: string
          last_name?: string | null
          school_id: string
          status?: string | null
        }
        Update: {
          admission_number?: string
          created_at?: string | null
          dob?: string
          first_name?: string
          gender?: string | null
          guardian_id?: string | null
          id?: string
          last_name?: string | null
          school_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          name: string
          school_id: string
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          name: string
          school_id: string
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          name?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      transfer_certificates: {
        Row: {
          created_at: string | null
          id: string
          leaving_date: string
          reason: string | null
          school_id: string
          student_id: string
          tc_number: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          leaving_date: string
          reason?: string | null
          school_id: string
          student_id: string
          tc_number: string
        }
        Update: {
          created_at?: string | null
          id?: string
          leaving_date?: string
          reason?: string | null
          school_id?: string
          student_id?: string
          tc_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "transfer_certificates_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfer_certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
