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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-6 animate-in">
          <div className="inline-flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-sm border border-indigo-100">
            <div className="bg-indigo-600 p-2 rounded-full">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-indigo-600">Business Analytics Platform</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
            Track Your Business
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Like a Pro
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
            Powerful analytics and insights for your business. Track sales, manage expenses, and make data-driven decisions.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 pt-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-indigo-50 p-3 rounded-lg flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Auth Card */}
        <div className="flex justify-center lg:justify-end animate-in">
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>

            <button
              onClick={onSignIn}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <LogIn className="w-5 h-5" />
                <span>Sign in with Google</span>
              </div>
            </button>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Shield className="w-4 h-4" />
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