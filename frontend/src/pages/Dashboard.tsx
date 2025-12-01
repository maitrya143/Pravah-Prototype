import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Skeleton, SkeletonCard } from '../components/Skeleton';
import { useCenter } from '../contexts/CenterContext';
import { api } from '../utils/api';

interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  attendanceRate: number;
  recentAdmissions: number;
}

export const Dashboard: React.FC = () => {
  const { selectedCenter } = useCenter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCenter) {
      loadDashboardStats();
    }
  }, [selectedCenter]);

  const loadDashboardStats = async () => {
    if (!selectedCenter) return;

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const startDate = startOfMonth.toISOString().split('T')[0];

      // Get students
      const studentsRes = await api.getStudentsByCenter(selectedCenter.id.toString());
      const totalStudents = studentsRes.students?.length || 0;

      // Get today's attendance
      const attendanceRes = await api.getAttendanceByDate(today, selectedCenter.id.toString());
      const attendance = attendanceRes.attendance || [];
      const presentToday = attendance.filter((a: any) => a.status === 'present').length;

      // Get admissions this month
      const historyRes = await api.getAdmissionsHistory(
        selectedCenter.id.toString(),
        startDate,
        today
      );
      const recentAdmissions = historyRes.admissions?.length || 0;

      // Calculate attendance rate
      const attendanceRate = totalStudents > 0 
        ? Math.round((presentToday / totalStudents) * 100) 
        : 0;

      setStats({
        totalStudents,
        presentToday,
        attendanceRate,
        recentAdmissions,
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>
          <h1 className="text-h2 text-warm-800 mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-h2 text-warm-800 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <h3 className="text-sm font-medium text-warm-500 mb-2">Total Students</h3>
            <p className="text-3xl font-bold text-primary-600">
              {stats?.totalStudents || 0}
            </p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-warm-500 mb-2">Present Today</h3>
            <p className="text-3xl font-bold text-accent-600">
              {stats?.presentToday || 0}
            </p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-warm-500 mb-2">New Admissions (This Month)</h3>
            <p className="text-3xl font-bold text-secondary-600">
              {stats?.recentAdmissions || 0}
            </p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-warm-500 mb-2">Attendance Rate</h3>
            <p className="text-3xl font-bold text-warm-700">
              {stats?.attendanceRate || 0}%
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <h2 className="text-h3 text-warm-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/new-admission">
                <Button variant="primary" className="w-full">
                  New Admission
                </Button>
              </Link>
              <Link to="/manual-attendance">
                <Button variant="outline" className="w-full">
                  Mark Attendance
                </Button>
              </Link>
              <Link to="/qr-scan">
                <Button variant="outline" className="w-full">
                  Scan QR Code
                </Button>
              </Link>
              <Link to="/diary">
                <Button variant="ghost" className="w-full">
                  Add Diary Entry
                </Button>
              </Link>
            </div>
          </Card>
          <Card>
            <h2 className="text-h3 text-warm-800 mb-4">Center Information</h2>
            {selectedCenter ? (
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span> {selectedCenter.name}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {selectedCenter.location}
                </p>
                <p>
                  <span className="font-medium">City:</span> {selectedCenter.city}
                </p>
                <p>
                  <span className="font-medium">Code:</span> {selectedCenter.code}
                </p>
              </div>
            ) : (
              <p className="text-warm-500">No center selected</p>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
