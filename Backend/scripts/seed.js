import dotenv from "dotenv";
dotenv.config();

import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { getCityFromVolunteerId } from '../utils/cityMapping.js';

// Sample data
const centers = [
  { name: 'Center Alpha', location: 'Mumbai', city: 'Mumbai', code: 'MUM-001' },
  { name: 'Center Beta', location: 'Delhi', city: 'Delhi', code: 'DLH-001' },
  { name: 'Center Gamma', location: 'Bangalore', city: 'Bangalore', code: 'BLR-001' },
  { name: 'Mouda Center', location: 'Mouda', city: 'Mouda', code: 'MDA-001' },
  { name: 'Nagpur Center', location: 'Nagpur', city: 'Nagpur', code: 'NGP-001' },
];

const volunteers = [
  { volunteer_id: '25MDA177', full_name: 'John Doe', password: 'password123' },
  { volunteer_id: '25NGP123', full_name: 'Jane Smith', password: 'password123' },
  { volunteer_id: '26BOM456', full_name: 'Bob Wilson', password: 'password123' },
  { volunteer_id: '27DLH789', full_name: 'Alice Brown', password: 'password123' },
];

// Generate 50 fake students
function generateStudents() {
  const firstNames = ['Raj', 'Priya', 'Aarav', 'Ananya', 'Vikram', 'Sneha', 'Arjun', 'Isha', 'Rohan', 'Diya', 
                      'Krishna', 'Meera', 'Arnav', 'Sanya', 'Aryan', 'Kavya', 'Rahul', 'Neha', 'Aditya', 'Shreya'];
  const lastNames = ['Kumar', 'Sharma', 'Patel', 'Singh', 'Gupta', 'Reddy', 'Mehta', 'Verma', 'Jain', 'Chopra',
                     'Malik', 'Yadav', 'Pandey', 'Rao', 'Joshi', 'Desai', 'Mishra', 'Thakur', 'Nair', 'Agarwal'];
  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  
  const students = [];
  let studentCounter = 1;
  
  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    const centerId = (Math.floor(Math.random() * centers.length) % centers.length) + 1;
    const studentClass = classes[Math.floor(Math.random() * classes.length)];
    
    // Generate random date of birth (5-15 years ago)
    const yearsAgo = 5 + Math.floor(Math.random() * 10);
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - yearsAgo);
    dob.setMonth(Math.floor(Math.random() * 12));
    dob.setDate(Math.floor(Math.random() * 28) + 1);
    
    // Generate parent name
    const parentFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const parentName = `${parentFirstName} ${lastName}`;
    
    // Generate contact number
    const contactNumber = `9${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    
    // Generate student_id
    const studentId = `STU${String(studentCounter).padStart(4, '0')}`;
    
    students.push({
      student_id: studentId,
      full_name: fullName,
      date_of_birth: dob.toISOString().split('T')[0],
      parent_name: parentName,
      contact_number: contactNumber,
      address: `Address ${i + 1}, ${centers[centerId - 1]?.location || 'City'}`,
      class: studentClass,
      center_id: centerId,
      admission_date: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    });
    
    studentCounter++;
  }
  
  return students;
}

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data (in reverse order of dependencies)
    console.log('Clearing existing data...');
    await client.query('DELETE FROM volunteer_attendance');
    await client.query('DELETE FROM admissions_history');
    await client.query('DELETE FROM syllabus_files');
    await client.query('DELETE FROM attendance');
    await client.query('DELETE FROM diary');
    await client.query('DELETE FROM students');
    await client.query('DELETE FROM users');
    await client.query('DELETE FROM centers');
    
    // Reset sequences
    await client.query("SELECT setval('centers_id_seq', 1, false)");
    await client.query("SELECT setval('users_id_seq', 1, false)");
    await client.query("SELECT setval('students_id_seq', 1, false)");
    
    // Seed centers
    console.log('Seeding centers...');
    for (const center of centers) {
      await client.query(
        `INSERT INTO centers (name, location, city, code) VALUES ($1, $2, $3, $4)`,
        [center.name, center.location, center.city, center.code]
      );
    }
    
    // Seed users/volunteers
    console.log('Seeding users/volunteers...');
    for (const volunteer of volunteers) {
      const passwordHash = await bcrypt.hash(volunteer.password, 10);
      const city = getCityFromVolunteerId(volunteer.volunteer_id);
      
      await client.query(
        `INSERT INTO users (volunteer_id, full_name, password_hash, city, role) VALUES ($1, $2, $3, $4, $5)`,
        [volunteer.volunteer_id, volunteer.full_name, passwordHash, city, 'volunteer']
      );
    }
    
    // Seed students
    console.log('Seeding students...');
    const students = generateStudents();
    
    for (const student of students) {
      await client.query(
        `INSERT INTO students (student_id, full_name, date_of_birth, parent_name, contact_number, address, class, center_id, admission_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          student.student_id,
          student.full_name,
          student.date_of_birth,
          student.parent_name,
          student.contact_number,
          student.address,
          student.class,
          student.center_id,
          student.admission_date
        ]
      );
    }
    
    // Seed some attendance records (last 7 days)
    console.log('Seeding attendance records...');
    const allStudents = await client.query('SELECT id, center_id FROM students');
    const users = await client.query('SELECT id FROM users LIMIT 1');
    const userId = users.rows[0]?.id;
    
    if (userId) {
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Randomly mark 70% of students as present
        for (const student of allStudents.rows) {
          if (Math.random() > 0.3) {
            await client.query(
              `INSERT INTO attendance (student_id, center_id, date, status, marked_by)
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT (student_id, date) DO NOTHING`,
              [student.id, student.center_id, dateStr, 'present', userId]
            );
          }
        }
      }
    }
    
    await client.query('COMMIT');
    console.log('✅ Database seeding completed successfully!');
    console.log(`   - ${centers.length} centers created`);
    console.log(`   - ${volunteers.length} users created`);
    console.log(`   - ${students.length} students created`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  });

