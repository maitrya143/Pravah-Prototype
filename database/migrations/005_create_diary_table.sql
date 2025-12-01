-- Create diary table
CREATE TABLE IF NOT EXISTS diary (
  id SERIAL PRIMARY KEY,
  center_id INTEGER REFERENCES centers(id) ON DELETE CASCADE,
  volunteer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  number_of_students INTEGER NOT NULL DEFAULT 0,
  in_time TIME,
  out_time TIME,
  thought_of_day TEXT,
  subject VARCHAR(255),
  topic TEXT,
  pdf_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(center_id, date)
);

CREATE INDEX idx_diary_center_id ON diary(center_id);
CREATE INDEX idx_diary_date ON diary(date);
CREATE INDEX idx_diary_volunteer_id ON diary(volunteer_id);

