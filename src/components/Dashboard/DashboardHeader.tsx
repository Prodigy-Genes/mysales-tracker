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
    <header className="mb-4 sm:mb-6 animate-in px-3 sm:px-0">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        {/* Welcome Section */}
        <div className="flex items-start gap-2 sm:gap-3 min-w-0">
          <div className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-lg">
            <User className="w-4 h-4 sm:w-5 sm:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 break-words">
              {getGreeting()},{' '}
              <span className="text-indigo-600">{firstName}</span>
            </h1>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 flex-wrap">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-4 text-gray-400 flex-shrink-0" />
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Private workspace
                </p>
              </div>
              <span className="hidden md:inline text-[10px] sm:text-xs text-gray-400">•</span>
              <p className="text-[10px] sm:text-xs text-gray-500 hidden md:block">
                User ID:{' '}
                <span className="font-mono text-[10px] sm:text-xs text-gray-600">
                  {userId.substring(0, 8)}...
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onSignOut}
          className="group relative px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl shadow-sm hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] self-start lg:self-auto w-fit"
          aria-label="Sign out of your account"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-5" />
            <span className="text-[10px] sm:text-sm">Sign Out</span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
