import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  unit?: string;           // e.g., '$', '%', 'kg'
  isPositive?: boolean;    // true = green/up, false = red/down, undefined = neutral
  trendText?: string;      // Optional text like '+5%' or '-2%'
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit = '$', isPositive, trendText }) => {
  const valueDisplay = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const colorClass = isPositive === true ? 'text-green-600' : isPositive === false ? 'text-red-600' : 'text-gray-900';
  const icon = isPositive === undefined ? null : isPositive ? <ArrowUp className="w-5 h-5 text-green-500" /> : <ArrowDown className="w-5 h-5 text-red-500" />;

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 transform hover:scale-[1.02] transition duration-300">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon && <span title={trendText}>{icon}</span>}
      </div>
      <div className="mt-1 flex justify-between items-end">
        <p className={`text-3xl font-bold ${colorClass}`}>
          {unit}{valueDisplay}
        </p>
        {trendText && <span className="text-sm font-medium text-gray-500 ml-2">{trendText}</span>}
      </div>
    </div>
  );
};

export default StatCard;
