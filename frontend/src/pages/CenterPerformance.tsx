import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';

export const CenterPerformance: React.FC = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-h2 text-warm-800 mb-6">Center Performance</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <h3 className="text-sm font-medium text-warm-500 mb-2">Total Students</h3>
            <p className="text-3xl font-bold text-primary-600">--</p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-warm-500 mb-2">Average Attendance</h3>
            <p className="text-3xl font-bold text-accent-600">--%</p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-warm-500 mb-2">Active Classes</h3>
            <p className="text-3xl font-bold text-secondary-600">--</p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-warm-500 mb-2">Performance Score</h3>
            <p className="text-3xl font-bold text-warm-700">--</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-h3 text-warm-800 mb-4">Attendance Trend</h2>
            <div className="h-64 bg-warm-100 rounded-lg flex items-center justify-center">
              <p className="text-warm-500">Chart will be displayed here</p>
            </div>
          </Card>
          <Card>
            <h2 className="text-h3 text-warm-800 mb-4">Performance Metrics</h2>
            <div className="h-64 bg-warm-100 rounded-lg flex items-center justify-center">
              <p className="text-warm-500">Metrics will be displayed here</p>
            </div>
          </Card>
        </div>

        <Card className="mt-6">
          <h2 className="text-h3 text-warm-800 mb-4">Detailed Reports</h2>
          <p className="text-warm-500">
            Performance analytics and reporting will be implemented in Phase 2
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

