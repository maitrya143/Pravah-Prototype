import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const QRScan: React.FC = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-h2 text-warm-800 mb-6">QR Code Scanner</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-h3 text-warm-800 mb-4">Scanner</h2>
            <div className="aspect-square bg-warm-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <span className="text-6xl mb-4 block">📱</span>
                <p className="text-warm-600">Camera preview will appear here</p>
                <p className="text-sm text-warm-500 mt-2">
                  QR scanning logic not implemented yet
                </p>
              </div>
            </div>
            <Button variant="primary" className="w-full">
              Start Scanning
            </Button>
          </Card>

          <Card>
            <h2 className="text-h3 text-warm-800 mb-4">Scan Result</h2>
            <div className="p-8 text-center text-warm-500">
              <p>No scan result yet</p>
              <p className="text-sm mt-2">
                Scan a QR code to see student information here
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

