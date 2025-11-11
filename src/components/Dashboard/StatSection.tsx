import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet, PiggyBank } from 'lucide-react';

interface StatsSectionProps {
  totalSales: number;
  totalExpenses: number;
  netIncome: number;
}

const StatsSection: React.FC<StatsSectionProps> = ({ totalSales, totalExpenses, netIncome }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const stats = [
    {
      title: 'Total Sales Revenue',
      value: totalSales,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      trend: totalSales > 0 ? '+' : '',
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: Wallet,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-600',
      trend: totalExpenses > 0 ? '-' : '',
    },
    {
      title: 'Net Income',
      value: netIncome,
      icon: PiggyBank,
      color: netIncome >= 0 ? 'from-indigo-500 to-indigo-600' : 'from-amber-500 to-amber-600',
      bgColor: netIncome >= 0 ? 'bg-indigo-50' : 'bg-amber-50',
      iconColor: netIncome >= 0 ? 'text-indigo-600' : 'text-amber-600',
      trend: netIncome >= 0 ? '+' : '-',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Gradient background accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -mr-16 -mt-16`}></div>
            
            <div className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                {stat.value !== 0 && (
                  <div className="flex items-center space-x-1">
                    {stat.trend === '+' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : stat.trend === '-' ? (
                      <TrendingDown className="w-4 h-4 text-rose-500" />
                    ) : null}
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(Math.abs(stat.value))}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsSection;