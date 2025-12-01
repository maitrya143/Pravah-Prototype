const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Set auth token in localStorage
export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

// Get user data from localStorage
export function getUserData() {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
}

// Set user data in localStorage
export function setUserData(user: any) {
  if (user) {
    localStorage.setItem('user_data', JSON.stringify(user));
  } else {
    localStorage.removeItem('user_data');
  }
}

// Get selected center from localStorage
export function getSelectedCenter() {
  const center = localStorage.getItem('selected_center');
  return center ? JSON.parse(center) : null;
}

// Set selected center in localStorage
export function setSelectedCenter(center: any) {
  if (center) {
    localStorage.setItem('selected_center', JSON.stringify(center));
  } else {
    localStorage.removeItem('selected_center');
  }
}

// API request helper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// API methods
export const api = {
  // Auth
  signup: (data: { volunteer_id: string; full_name: string; password: string }) =>
    apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { volunteer_id: string; password: string }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentUser: () => apiRequest('/auth/me'),

  // Centers
  getMyCenters: () => apiRequest('/centers/my-centers'),

  getCenter: (id: string) => apiRequest(`/centers/${id}`),

  // Users
  getVolunteers: (center_id?: string) => {
    const query = center_id ? `?center_id=${center_id}` : '';
    return apiRequest(`/users/volunteers${query}`);
  },

  // Students
  getStudentsByCenter: (centerId: string) =>
    apiRequest(`/students/center/${centerId}`),

  createStudent: (data: FormData) => {
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/students/admission`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((err) => {
          throw new Error(err.error || 'Failed to create student');
        });
      }
      return res.json();
    });
  },

  // Attendance
  markAttendanceFromQR: (qrData: string) =>
    apiRequest('/attendance/qr-scan', {
      method: 'POST',
      body: JSON.stringify({ qr_data: qrData }),
    }),

  bulkMarkAttendance: (data: {
    attendance_data: any[];
    center_id: string;
    date: string;
  }) =>
    apiRequest('/attendance/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAttendanceByDate: (date: string, centerId: string) =>
    apiRequest(`/attendance/date/${date}?center_id=${centerId}`),

  getAttendancePDF: (date: string, centerId: string) => {
    const token = getAuthToken();
    return `${API_BASE_URL}/attendance/pdf/${date}?center_id=${centerId}&token=${token}`;
  },

  // Diary
  createDiary: (data: any) =>
    apiRequest('/diary', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getDiaryByDate: (date: string, centerId: string) =>
    apiRequest(`/diary/date/${date}?center_id=${centerId}`),

  getDiaryPDF: (date: string, centerId: string) => {
    const token = getAuthToken();
    return `${API_BASE_URL}/diary/pdf/${date}?center_id=${centerId}&token=${token}`;
  },

  // Syllabus
  uploadSyllabus: (data: FormData) => {
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/syllabus/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((err) => {
          throw new Error(err.error || 'Failed to upload syllabus');
        });
      }
      return res.json();
    });
  },

  getSyllabusByCenter: (centerId: string) =>
    apiRequest(`/syllabus/center/${centerId}`),

  downloadSyllabus: (id: string) => {
    const token = getAuthToken();
    return `${API_BASE_URL}/syllabus/download/${id}?token=${token}`;
  },

  // Performance
  getCenterPerformance: (centerId: string, startDate: string, endDate: string) =>
    apiRequest(`/performance/center/${centerId}?start_date=${startDate}&end_date=${endDate}`),

  // History
  getHistory: (centerId: string, startDate: string, endDate: string) =>
    apiRequest(`/history/all?center_id=${centerId}&start_date=${startDate}&end_date=${endDate}`),

  getAdmissionsHistory: (centerId: string, startDate: string, endDate: string) =>
    apiRequest(`/history/admissions?center_id=${centerId}&start_date=${startDate}&end_date=${endDate}`),

  getAttendanceHistory: (centerId: string, startDate: string, endDate: string) =>
    apiRequest(`/history/attendance?center_id=${centerId}&start_date=${startDate}&end_date=${endDate}`),
};

