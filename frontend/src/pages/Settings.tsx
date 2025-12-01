import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const Settings: React.FC = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-h2 text-warm-800 mb-6">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-h3 text-warm-800 mb-6">Profile Settings</h2>
            <div className="space-y-4">
              <Input
                type="text"
                label="Full Name"
                defaultValue="John Doe"
              />
              <Input
                type="email"
                label="Email"
                defaultValue="john.doe@example.com"
              />
              <Input
                type="tel"
                label="Phone Number"
                defaultValue="+1234567890"
              />
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-h3 text-warm-800 mb-6">Account Settings</h2>
            <div className="space-y-4">
              <Input
                type="password"
                label="Current Password"
                placeholder="Enter current password"
              />
              <Input
                type="password"
                label="New Password"
                placeholder="Enter new password"
              />
              <Input
                type="password"
                label="Confirm New Password"
                placeholder="Confirm new password"
              />
              <Button variant="primary">Update Password</Button>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <h2 className="text-h3 text-warm-800 mb-6">Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-warm-700">Email notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" defaultChecked />
                <span className="text-warm-700">SMS notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" defaultChecked />
                <span className="text-warm-700">Dark mode</span>
              </label>
            </div>
            <Button variant="primary" className="mt-4">Save Preferences</Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

