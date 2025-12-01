-- Create syllabus_files table
CREATE TABLE IF NOT EXISTS syllabus_files (
  id SERIAL PRIMARY KEY,
  center_id INTEGER REFERENCES centers(id) ON DELETE CASCADE,
  class VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by INTEGER REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(center_id, class)
);

CREATE INDEX idx_syllabus_files_center_id ON syllabus_files(center_id);
CREATE INDEX idx_syllabus_files_class ON syllabus_files(class);

