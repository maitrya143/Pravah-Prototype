import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { Input } from '../components/Input';

export const History: React.FC = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-h2 text-warm-800 mb-6">History</h1>

        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="date"
              label="From Date"
            />
            <Input
              type="date"
              label="To Date"
            />
            <div className="flex items-end">
              <button className="btn btn-primary w-full">
                Filter
              </button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-h3 text-warm-800 mb-4">Historical Records</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-warm-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-warm-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-warm-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-warm-700">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-warm-700">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="text-center py-12 text-warm-500">
                    No historical records found
                    <p className="text-sm mt-2">History data will be displayed here</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

