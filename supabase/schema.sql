-- ================================================
-- Student Performance Tracker - Database Schema
-- Run this in your Supabase SQL Editor
-- ================================================

-- Students table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  roll_no TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Semester marks table
CREATE TABLE semester_marks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
  marks DECIMAL(5,2) NOT NULL CHECK (marks >= 0 AND marks <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, semester)
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE semester_marks ENABLE ROW LEVEL SECURITY;

-- Public access policies (for demo/academic purposes)
CREATE POLICY "public_read_students" ON students FOR SELECT USING (true);
CREATE POLICY "public_insert_students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_students" ON students FOR UPDATE USING (true);
CREATE POLICY "public_delete_students" ON students FOR DELETE USING (true);

CREATE POLICY "public_read_marks" ON semester_marks FOR SELECT USING (true);
CREATE POLICY "public_insert_marks" ON semester_marks FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_marks" ON semester_marks FOR UPDATE USING (true);
CREATE POLICY "public_delete_marks" ON semester_marks FOR DELETE USING (true);

-- Indexes for performance
CREATE INDEX idx_semester_marks_student_id ON semester_marks(student_id);
CREATE INDEX idx_students_roll_no ON students(roll_no);
