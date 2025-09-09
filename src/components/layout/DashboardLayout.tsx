import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import Joyride, { Step } from 'react-joyride';

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const steps: Step[] = [
    {
      target: '.sidebar-meetings',
      content: 'This is where you can access your meetings!',
    },
    {
      target: '.calendar-view', 
      content: 'Here’s your calendar where all meetings are displayed.',
    },
    {
      target: '.schedule-button', 
      content: 'Click here to schedule a new meeting.',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 relative">
          <Joyride
            steps={steps}
            continuous
            showSkipButton
            styles={{
              options: {
                zIndex: 10000,
              },
            }}
          />

          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
