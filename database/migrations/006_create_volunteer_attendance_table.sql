-- Create volunteer_attendance table (for diary entries)
CREATE TABLE IF NOT EXISTS volunteer_attendance (
  id SERIAL PRIMARY KEY,
  diary_id INTEGER REFERENCES diary(id) ON DELETE CASCADE,
  volunteer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'present', -- present, absent
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(diary_id, volunteer_id)
);

CREATE INDEX idx_volunteer_attendance_diary_id ON volunteer_attendance(diary_id);
CREATE INDEX idx_volunteer_attendance_volunteer_id ON volunteer_attendance(volunteer_id);

