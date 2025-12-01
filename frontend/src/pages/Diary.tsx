import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const Diary: React.FC = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-h2 text-warm-800 mb-6">Daily Diary</h1>

        <Card>
          <div className="mb-6">
            <Input
              type="date"
              label="Date"
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-warm-700 mb-2">
              Diary Entry
            </label>
            <textarea
              className="input min-h-[300px]"
              placeholder="Write your diary entry for today..."
            />
          </div>

          <div className="flex gap-4">
            <Button variant="primary">Save Entry</Button>
            <Button variant="outline">Clear</Button>
          </div>
        </Card>

        <Card className="mt-6">
          <h2 className="text-h3 text-warm-800 mb-4">Previous Entries</h2>
          <div className="text-center py-8 text-warm-500">
            <p>No previous entries to display</p>
            <p className="text-sm mt-2">Diary entries will be listed here</p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

