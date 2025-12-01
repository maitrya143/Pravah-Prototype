import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const ManualAttendance: React.FC = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-h2 text-warm-800 mb-6">Manual Attendance</h1>

        <Card>
          <div className="mb-6">
            <Input
              type="date"
              label="Date"
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-warm-200 rounded-lg">
              <div>
                <h3 className="font-medium text-warm-800">Student Name</h3>
                <p className="text-sm text-warm-500">Student ID: ---</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-sm font-medium">Present</span>
              </label>
            </div>

            <div className="text-center py-8 text-warm-500">
              <p>Student list will be loaded here</p>
              <p className="text-sm mt-2">No business logic implemented yet</p>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button variant="primary">Save Attendance</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

