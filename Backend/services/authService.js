import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { getCityFromVolunteerId } from '../utils/cityMapping.js';

export async function signup(volunteerId, fullName, password) {
  // Check if volunteer_id already exists
  const existingUser = await query('SELECT id FROM users WHERE volunteer_id = $1', [volunteerId]);
  if (existingUser.rows.length > 0) {
    throw new Error('Volunteer ID already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);
  
  // Get city from volunteer_id
  const city = getCityFromVolunteerId(volunteerId);

  // Insert user
  const result = await query(
    `INSERT INTO users (volunteer_id, full_name, password_hash, city, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, volunteer_id, full_name, city, role`,
    [volunteerId, fullName, passwordHash, city, 'volunteer']
  );

  const user = result.rows[0];
  
  // Generate token
  const token = generateToken({
    id: user.id,
    volunteer_id: user.volunteer_id,
    role: user.role,
  });

  return { user, token };
}

export async function login(volunteerId, password) {
  // Find user by volunteer_id
  const result = await query(
    'SELECT id, volunteer_id, full_name, password_hash, city, role FROM users WHERE volunteer_id = $1',
    [volunteerId]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid volunteer ID or password');
  }

  const user = result.rows[0];

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid volunteer ID or password');
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    volunteer_id: user.volunteer_id,
    role: user.role,
  });

  // Remove password_hash from response
  delete user.password_hash;

  return { user, token };
}

export async function getCurrentUser(userId) {
  const result = await query(
    'SELECT id, volunteer_id, full_name, city, role FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
}

