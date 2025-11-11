import React from 'react';
import { LogOut, User, Shield } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string | null;
  userId: string;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, userId, onSignOut }) => {
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = userName?.split(' ')[0] || 'User';

  return (
    <header className="mb-8 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Welcome Section */}
        <div className="flex items-start space-x-4">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {getGreeting()}, <span className="text-indigo-600">{firstName}</span>
            </h1>
            <div className="flex items-center space-x-2 mt-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-500">
                Private workspace
                <span className="hidden sm:inline"> • User ID: </span>
                <span className="font-mono text-xs text-gray-600 hidden sm:inline">
                  {userId.substring(0, 12)}...
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onSignOut}
          className="group relative px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl shadow-sm hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
        >
          <div className="flex items-center space-x-2">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;