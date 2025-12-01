import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const NewAdmission: React.FC = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-h2 text-warm-800 mb-6">New Admission</h1>

        <Card>
          <h2 className="text-h3 text-warm-800 mb-6">Student Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              type="text"
              label="Student Name"
              placeholder="Enter full name"
            />
            <Input
              type="date"
              label="Date of Birth"
            />
            <Input
              type="text"
              label="Parent/Guardian Name"
              placeholder="Enter parent name"
            />
            <Input
              type="tel"
              label="Contact Number"
              placeholder="Enter contact number"
            />
            <Input
              type="text"
              label="Address"
              placeholder="Enter address"
              className="md:col-span-2"
            />
            <Input
              type="text"
              label="Class/Grade"
              placeholder="Enter class"
            />
            <Input
              type="date"
              label="Admission Date"
            />
          </div>

          <div className="flex gap-4">
            <Button variant="primary">Submit Admission</Button>
            <Button variant="outline">Cancel</Button>
          </div>

          <p className="mt-4 text-sm text-warm-500">
            * Form submission logic will be implemented in Phase 2
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

