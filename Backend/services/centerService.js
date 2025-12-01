import { query } from '../config/database.js';
import { getCityFromVolunteerId } from '../utils/cityMapping.js';

export async function getCentersByVolunteerId(volunteerId) {
  const city = getCityFromVolunteerId(volunteerId);
  
  const result = await query(
    'SELECT id, name, location, city, code FROM centers WHERE city = $1 ORDER BY name',
    [city]
  );

  return result.rows;
}

export async function getAllCenters() {
  const result = await query(
    'SELECT id, name, location, city, code FROM centers ORDER BY city, name'
  );

  return result.rows;
}

export async function getCenterById(centerId) {
  const result = await query(
    'SELECT id, name, location, city, code, address FROM centers WHERE id = $1',
    [centerId]
  );

  return result.rows[0];
}

