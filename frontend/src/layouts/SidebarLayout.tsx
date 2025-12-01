import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: string; // Using emoji as placeholder, replace with actual icons later
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/manual-attendance', label: 'Manual Attendance', icon: '✋' },
  { path: '/qr-scan', label: 'QR Scan', icon: '📱' },
  { path: '/new-admission', label: 'New Admission', icon: '➕' },
  { path: '/diary', label: 'Diary', icon: '📔' },
  { path: '/syllabus', label: 'Syllabus', icon: '📚' },
  { path: '/center-performance', label: 'Center Performance', icon: '📈' },
  { path: '/history', label: 'History', icon: '🕐' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-warm-50">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-warm-200 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 border-b border-warm-200">
            <div className="flex items-center gap-3">
              {!isCollapsed && (
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-primary-600">Pravah</h1>
                  <p className="text-xs text-warm-500">Flow of Change</p>
                </div>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 hover:bg-warm-100 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                {isCollapsed ? '→' : '←'}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

