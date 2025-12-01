import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarLayout } from './SidebarLayout';
import { useAuth } from '../contexts/AuthContext';
import { useCenter } from '../contexts/CenterContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const { selectedCenter } = useCenter();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <SidebarLayout>
      <div className="flex flex-col h-full">
        {/* Topbar */}
        <header className="bg-white border-b border-warm-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                P
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary-600">Pravah</h1>
                <p className="text-xs text-warm-500">Flow of Change</p>
              </div>
            </div>

            {/* Right: User Info & Actions */}
            <div className="flex items-center gap-6">
              {/* Volunteer Info */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="text-right">
                  <p className="font-medium text-warm-800">
                    Volunteer: <span className="text-primary-600">{user?.full_name || 'N/A'}</span>
                  </p>
                  <p className="text-warm-500">
                    ID: <span className="text-warm-700">{user?.volunteer_id || 'N/A'}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-warm-500">Center:</p>
                  <p className="font-medium text-warm-800">{selectedCenter?.name || 'Not Selected'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSettings}
                  className="p-2 hover:bg-warm-100 rounded-lg transition-colors"
                  aria-label="Settings"
                  title="Settings"
                >
                  <span className="text-xl">⚙️</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-warm-100 rounded-lg transition-colors text-red-600"
                  aria-label="Logout"
                  title="Logout"
                >
                  <span className="text-xl">🚪</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </SidebarLayout>
  );
};

