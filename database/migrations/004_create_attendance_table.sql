-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  center_id INTEGER REFERENCES centers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'present', -- present, absent, late
  marked_by INTEGER REFERENCES users(id),
  marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  qr_scanned BOOLEAN DEFAULT FALSE,
  UNIQUE(student_id, date)
);

CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_center_id ON attendance(center_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_date_center ON attendance(date, center_id);

