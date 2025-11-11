import React from 'react';
import { LogIn, TrendingUp, Lock, Shield, BarChart3 } from 'lucide-react';

interface AuthScreenProps {
  onSignIn: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onSignIn }) => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Track Revenue',
      description: 'Monitor sales and revenue trends in real-time',
    },
    {
      icon: BarChart3,
      title: 'Analyze Expenses',
      description: 'Categorize and visualize your business expenses',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and completely private',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-5 lg:space-y-6 animate-in">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm border border-blue-100">
            <div className="bg-blue-600 p-2 rounded-full">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-sm sm:text-base font-semibold text-blue-700">Business Analytics Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-black leading-snug">
            Track Your Business
            <span className="block text-blue-700 mt-1 sm:mt-2">With Ease</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-700 max-w-md mx-auto lg:mx-0">
            Powerful analytics and insights for your business. Track sales, manage expenses, and make data-driven decisions.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 pt-3 sm:pt-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-blue-50 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                  <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-black text-sm sm:text-base mb-1">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Auth Card */}
        <div className="flex justify-center lg:justify-end animate-in mt-6 lg:mt-0">
          <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-blue-100 w-full max-w-md">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl shadow-lg mb-3 sm:mb-4">
                <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-black mb-1 sm:mb-2">Welcome</h2>
              <p className="text-xs sm:text-sm text-gray-700">Sign in to access your dashboard</p>
            </div>

            <button
              onClick={onSignIn}
              className="group relative w-full py-3 sm:py-4 px-4 sm:px-6 bg-blue-600 text-white font-bold rounded-xl shadow hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
              <div className="relative flex items-center justify-center space-x-2 sm:space-x-3">
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Continue with Google</span>
              </div>
            </button>

            <div className="mt-4 sm:mt-6 pt-4 border-t border-blue-100">
              <div className="flex items-center justify-center space-x-2 text-[10px] sm:text-xs text-gray-500">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Secured with industry-standard encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
