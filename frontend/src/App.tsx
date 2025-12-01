import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CenterProvider } from './contexts/CenterContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { CenterSelection } from './pages/CenterSelection';
import { Dashboard } from './pages/Dashboard';
import { ManualAttendance } from './pages/ManualAttendance';
import { QRScan } from './pages/QRScan';
import { NewAdmission } from './pages/NewAdmission';
import { Diary } from './pages/Diary';
import { Syllabus } from './pages/Syllabus';
import { CenterPerformance } from './pages/CenterPerformance';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import './styles/index.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CenterProvider>
          <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes - No Center Required */}
            <Route
              path="/center-selection"
              element={
                <ProtectedRoute requireCenter={false}>
                  <CenterSelection />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Center Required */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manual-attendance"
              element={
                <ProtectedRoute>
                  <ManualAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/qr-scan"
              element={
                <ProtectedRoute>
                  <QRScan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new-admission"
              element={
                <ProtectedRoute>
                  <NewAdmission />
                </ProtectedRoute>
              }
            />
            <Route
              path="/diary"
              element={
                <ProtectedRoute>
                  <Diary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/syllabus"
              element={
                <ProtectedRoute>
                  <Syllabus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/center-performance"
              element={
                <ProtectedRoute>
                  <CenterPerformance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
        </CenterProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

