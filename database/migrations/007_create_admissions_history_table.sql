-- Create admissions_history table
CREATE TABLE IF NOT EXISTS admissions_history (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  center_id INTEGER REFERENCES centers(id) ON DELETE CASCADE,
  admitted_by INTEGER REFERENCES users(id),
  admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  student_name VARCHAR(255) NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20),
  class VARCHAR(50),
  qr_code TEXT,
  admission_form_image_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admissions_history_student_id ON admissions_history(student_id);
CREATE INDEX idx_admissions_history_center_id ON admissions_history(center_id);
CREATE INDEX idx_admissions_history_date ON admissions_history(admission_date);

