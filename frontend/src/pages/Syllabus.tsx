import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const Syllabus: React.FC = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-h2 text-warm-800 mb-6">Syllabus Management</h1>

        <div className="mb-6 flex gap-4">
          <Button variant="primary">Add New Syllabus</Button>
          <Button variant="outline">Upload File</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <Card key={item} hover>
              <h3 className="text-h3 text-warm-800 mb-2">Class {item}</h3>
              <p className="text-sm text-warm-500 mb-4">No syllabus uploaded yet</p>
              <Button variant="outline" className="w-full">
                View Syllabus
              </Button>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <h2 className="text-h3 text-warm-800 mb-4">Syllabus Details</h2>
          <p className="text-warm-500">
            Syllabus management functionality will be implemented in Phase 2
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

