// City mapping from volunteer_id prefix
// Format: XXCITYNNN where XX is number, CITY is city code, NNN is volunteer number
// Example: 25MDA177 -> Mouda

export const cityMapping = {
  'MDA': 'Mouda',
  'NGP': 'Nagpur',
  'BOM': 'Mumbai',
  'DLH': 'Delhi',
  'BLR': 'Bangalore',
  'CHN': 'Chennai',
  'KOL': 'Kolkata',
  'HYD': 'Hyderabad',
  'PUN': 'Pune',
  'AHM': 'Ahmedabad',
};

// Extract city from volunteer_id
export function getCityFromVolunteerId(volunteerId) {
  // Pattern: XXCITYNNN (e.g., 25MDA177)
  const match = volunteerId.match(/^\d{2}([A-Z]{3})\d+$/);
  if (match && match[1]) {
    const cityCode = match[1];
    return cityMapping[cityCode] || 'Unknown';
  }
  return 'Unknown';
}

// Get city code from volunteer_id
export function getCityCodeFromVolunteerId(volunteerId) {
  const match = volunteerId.match(/^\d{2}([A-Z]{3})\d+$/);
  return match && match[1] ? match[1] : null;
}

