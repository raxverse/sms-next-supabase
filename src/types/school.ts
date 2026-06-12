export interface School {
  id: string
  name: string
  code: string
  address: string
  city: string
  state: string
  phone: string
  email: string
  created_at: string
  updated_at: string
}

export interface Session {
  id: string;
  session_name: string;
}

export interface SessionClassSection {
  id: string;
}

export interface Class {
  id: string;
}

export interface Section {
  id: string;
}

export interface Subject {
  id: string;
}

export interface Exam {
  id: string;
}

export interface ExamMark {
  id: string;
}

export interface StudentFeeStatus {
  id: string;
}
