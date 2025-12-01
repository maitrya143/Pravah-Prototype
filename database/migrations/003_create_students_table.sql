-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20),
  address TEXT,
  class VARCHAR(50),
  center_id INTEGER REFERENCES centers(id) ON DELETE CASCADE,
  qr_code TEXT,
  admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  admission_form_image_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_center_id ON students(center_id);
CREATE INDEX idx_students_class ON students(class);

