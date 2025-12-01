// Shared TypeScript types/interfaces
// These will be used by both frontend and backend in Phase 2

export interface User {
  id: string;
  name: string;
  email: string;
  volunteerId: string;
  role: 'volunteer' | 'admin' | 'coordinator';
}

export interface Center {
  id: string;
  name: string;
  location: string;
  address?: string;
}

export interface Student {
  id: string;
  name: string;
  dateOfBirth: Date;
  parentName: string;
  contactNumber: string;
  address: string;
  class: string;
  admissionDate: Date;
  centerId: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
  markedBy: string;
  centerId: string;
}

export interface DiaryEntry {
  id: string;
  date: Date;
  content: string;
  volunteerId: string;
  centerId: string;
}

// Additional types will be added in Phase 2

