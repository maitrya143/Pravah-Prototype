// src/mocks/mockData.js
// Seed data for MSW mocks - 40 synthetic students across Mouda & Nagpur centers

// Helper to generate QR string
function generateQRString(studentId, centerId) {
  const timestamp = Date.now();
  const payload = `${studentId}|${centerId}|${timestamp}`;
  const base64Payload = btoa(payload);
  const signature = `sig_${Math.random().toString(36).substring(2, 15)}`;
  return `${base64Payload}|${signature}`;
}

// Centers for Mouda (10 centers)
const moudaCenters = [
  { id: 1, name: 'Nathnagar Centre', location: 'Nathnagar, Mouda', city: 'Mouda', code: 'MDA-001' },
  { id: 2, name: 'Gurdeo Chowk Centre', location: 'Gurdeo Chowk, Mouda', city: 'Mouda', code: 'MDA-002' },
  { id: 3, name: 'Mouda Main Centre', location: 'Mouda Main Road', city: 'Mouda', code: 'MDA-003' },
  { id: 4, name: 'Brahmanwada Centre', location: 'Brahmanwada, Mouda', city: 'Mouda', code: 'MDA-004' },
  { id: 5, name: 'Nimgaon Centre', location: 'Nimgaon, Mouda', city: 'Mouda', code: 'MDA-005' },
  { id: 6, name: 'Bhendala Centre', location: 'Bhendala, Mouda', city: 'Mouda', code: 'MDA-006' },
  { id: 7, name: 'Shivaji Nagar Centre', location: 'Shivaji Nagar, Mouda', city: 'Mouda', code: 'MDA-007' },
  { id: 8, name: 'Ram Nagar Centre', location: 'Ram Nagar, Mouda', city: 'Mouda', code: 'MDA-008' },
  { id: 9, name: 'Mahatma Gandhi Centre', location: 'MG Road, Mouda', city: 'Mouda', code: 'MDA-009' },
  { id: 10, name: 'Gandhi Chowk Centre', location: 'Gandhi Chowk, Mouda', city: 'Mouda', code: 'MDA-010' },
];

// Centers for Nagpur (10 centers)
const nagpurCenters = [
  { id: 11, name: 'IT Park Centre', location: 'IT Park, Nagpur', city: 'Nagpur', code: 'NGP-001' },
  { id: 12, name: 'Civil Lines Centre', location: 'Civil Lines, Nagpur', city: 'Nagpur', code: 'NGP-002' },
  { id: 13, name: 'Dharampeth Centre', location: 'Dharampeth, Nagpur', city: 'Nagpur', code: 'NGP-003' },
  { id: 14, name: 'Sitabuldi Centre', location: 'Sitabuldi, Nagpur', city: 'Nagpur', code: 'NGP-004' },
  { id: 15, name: 'Mahal Centre', location: 'Mahal, Nagpur', city: 'Nagpur', code: 'NGP-005' },
  { id: 16, name: 'Bajaj Nagar Centre', location: 'Bajaj Nagar, Nagpur', city: 'Nagpur', code: 'NGP-006' },
  { id: 17, name: 'Hingna Centre', location: 'Hingna, Nagpur', city: 'Nagpur', code: 'NGP-007' },
  { id: 18, name: 'Koradi Centre', location: 'Koradi, Nagpur', city: 'Nagpur', code: 'NGP-008' },
  { id: 19, name: 'Jamtha Centre', location: 'Jamtha, Nagpur', city: 'Nagpur', code: 'NGP-009' },
  { id: 20, name: 'Butibori Centre', location: 'Butibori, Nagpur', city: 'Nagpur', code: 'NGP-010' },
];

export const mockCenters = [...moudaCenters, ...nagpurCenters];

// Student names
const firstNames = [
  'Raj', 'Priya', 'Aarav', 'Ananya', 'Vikram', 'Sneha', 'Arjun', 'Isha',
  'Rohan', 'Diya', 'Krishna', 'Meera', 'Arnav', 'Sanya', 'Aryan', 'Kavya',
  'Rahul', 'Neha', 'Aditya', 'Shreya', 'Ravi', 'Pooja', 'Sachin', 'Kritika',
  'Mohan', 'Swati', 'Ankit', 'Riya', 'Karan', 'Simran', 'Nikhil', 'Divya',
  'Vishal', 'Anjali', 'Siddharth', 'Aishwarya', 'Amit', 'Deepika', 'Rohit', 'Preeti',
];

const lastNames = [
  'Kumar', 'Sharma', 'Patel', 'Singh', 'Gupta', 'Reddy', 'Mehta', 'Verma',
  'Jain', 'Chopra', 'Malik', 'Yadav', 'Pandey', 'Rao', 'Joshi', 'Desai',
];

// Generate 40 students (20 in Mouda centers, 20 in Nagpur centers)
function generateStudents() {
  const students = [];
  let studentCounter = 1;

  // Distribute 20 students across Mouda centers (2 per center)
  moudaCenters.forEach((center) => {
    for (let i = 0; i < 2; i++) {
      const firstName = firstNames[(studentCounter - 1) % firstNames.length];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const studentId = `STU${String(studentCounter).padStart(4, '0')}`;
      const studentClass = String(Math.floor(Math.random() * 10) + 1);

      // Generate date of birth (5-15 years ago)
      const yearsAgo = 5 + Math.floor(Math.random() * 10);
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - yearsAgo);
      dob.setMonth(Math.floor(Math.random() * 12));
      dob.setDate(Math.floor(Math.random() * 28) + 1);

      students.push({
        id: studentCounter,
        student_id: studentId,
        full_name: fullName,
        date_of_birth: dob.toISOString().split('T')[0],
        parent_name: `${firstNames[(studentCounter + 5) % firstNames.length]} ${lastName}`,
        contact_number: `9${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        address: `Address ${studentCounter}, ${center.location}`,
        class: studentClass,
        center_id: center.id,
        admission_date: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        qr_code: generateQRString(studentId, center.id),
        qr_string: generateQRString(studentId, center.id),
      });

      studentCounter++;
    }
  });

  // Distribute 20 students across Nagpur centers (2 per center)
  nagpurCenters.forEach((center) => {
    for (let i = 0; i < 2; i++) {
      const firstName = firstNames[(studentCounter - 1) % firstNames.length];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const studentId = `STU${String(studentCounter).padStart(4, '0')}`;
      const studentClass = String(Math.floor(Math.random() * 10) + 1);

      const yearsAgo = 5 + Math.floor(Math.random() * 10);
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - yearsAgo);
      dob.setMonth(Math.floor(Math.random() * 12));
      dob.setDate(Math.floor(Math.random() * 28) + 1);

      students.push({
        id: studentCounter,
        student_id: studentId,
        full_name: fullName,
        date_of_birth: dob.toISOString().split('T')[0],
        parent_name: `${firstNames[(studentCounter + 5) % firstNames.length]} ${lastName}`,
        contact_number: `9${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        address: `Address ${studentCounter}, ${center.location}`,
        class: studentClass,
        center_id: center.id,
        admission_date: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        qr_code: generateQRString(studentId, center.id),
        qr_string: generateQRString(studentId, center.id),
      });

      studentCounter++;
    }
  });

  return students;
}

export const mockStudents = generateStudents();

// Mock users/volunteers
export const mockUsers = [
  {
    id: 1,
    volunteer_id: '25MDA177',
    full_name: 'John Doe',
    city: 'Mouda',
    role: 'volunteer',
  },
  {
    id: 2,
    volunteer_id: '25NGP123',
    full_name: 'Jane Smith',
    city: 'Nagpur',
    role: 'volunteer',
  },
];
