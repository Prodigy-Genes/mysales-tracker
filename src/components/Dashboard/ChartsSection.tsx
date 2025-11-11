import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { ChartDataPoint, ExpenseCategoryData } from '@/src/types/dashboard';

interface ChartsSectionProps {
  weeklySalesData: ChartDataPoint[];
  expenseCategoryData: ExpenseCategoryData[];
  currencySymbol?: string;
}

const EXPENSE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0054', '#8884d8'];

const formatWeekLabel = (weekKey: string): string => {
  if (!weekKey) return 'N/A';
  const [year, weekNum] = weekKey.split('-');
  return `W${parseInt(weekNum, 10) + 1} ${year}`;
};

const ChartsSection: React.FC<ChartsSectionProps> = ({ weeklySalesData, expenseCategoryData, currencySymbol = '₵' }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-in">
      {/* Weekly Sales Trend */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-50 p-2.5 rounded-xl">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Weekly Sales Trend</h3>
          </div>
        </div>

        <div className="h-80">
          {weeklySalesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklySalesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="week" 
                  tickFormatter={formatWeekLabel}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tickFormatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip
                  formatter={(value) => [`${currencySymbol}${(value as number).toFixed(2)}`, 'Sales Total']}
                  labelFormatter={formatWeekLabel}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />

                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#4F46E5" 
                  strokeWidth={3} 
                  dot={{ fill: '#4F46E5', r: 5, strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 2 }} 
                  name="Weekly Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No sales data available</p>
              <p className="text-xs mt-1">Add your first sale to see trends</p>
            </div>
          )}
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-rose-50 p-2.5 rounded-xl">
              <PieChartIcon className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Expense Breakdown</h3>
          </div>
        </div>

        <div className="h-80">
          {expenseCategoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={expenseCategoryData as Array<{ name: string; value: number; [key: string]: string | number }>}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  labelLine={false}
                  label={(props: { name?: string; percent?: number }) => {
                    const { name = '', percent = 0 } = props;
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                >
                  {expenseCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${currencySymbol}${(value as number).toFixed(2)}`, 'Total Spent']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />

                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No expense data available</p>
              <p className="text-xs mt-1">Add your first expense to see breakdown</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;