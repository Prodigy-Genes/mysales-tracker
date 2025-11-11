import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { ChartDataPoint, ExpenseCategoryData } from '@/src/types/dashboard';

interface ChartsSectionProps {
  weeklySalesData: ChartDataPoint[];
  expenseCategoryData: ExpenseCategoryData[];
  currencySymbol?: string;
}

interface ExpenseDataWithPercentage extends ExpenseCategoryData {
  percentage: number;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

const EXPENSE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0054', '#8884d8'];

const formatWeekLabel = (weekKey: string): string => {
  if (!weekKey) return 'N/A';
  const [year, weekNum] = weekKey.split('-');
  return `W${parseInt(weekNum, 10) + 1} ${year}`;
};

const ChartsSection: React.FC<ChartsSectionProps> = ({ weeklySalesData, expenseCategoryData, currencySymbol = '₵' }) => {
  // Calculate total expenses for accurate percentages
  const totalExpenses = expenseCategoryData.reduce((sum, item) => sum + item.value, 0);
  
  // Prepare data with calculated percentages
  const expenseDataWithPercentages: ExpenseDataWithPercentage[] = expenseCategoryData.map(item => ({
    ...item,
    percentage: totalExpenses > 0 ? (item.value / totalExpenses) * 100 : 0
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6 sm:mb-8 animate-in px-4 sm:px-0">
      {/* Weekly Sales Trend */}
      <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex-shrink-0 bg-indigo-50 p-2 sm:p-2.5 rounded-lg sm:rounded-xl">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            </div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900 truncate">Weekly Sales Trend</h3>
          </div>
        </div>

        <div className="h-64 sm:h-80">
          {weeklySalesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={weeklySalesData} 
                margin={{ 
                  top: 5, 
                  right: window.innerWidth < 640 ? 10 : 30, 
                  left: window.innerWidth < 640 ? 0 : 20, 
                  bottom: 5 
                }}
              >
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
                  tick={{ fill: '#6b7280', fontSize: window.innerWidth < 640 ? 10 : 12 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  angle={window.innerWidth < 640 ? -45 : 0}
                  textAnchor={window.innerWidth < 640 ? 'end' : 'middle'}
                  height={window.innerWidth < 640 ? 60 : 30}
                />
                <YAxis
                  tickFormatter={(value) => {
                    if (window.innerWidth < 640) {
                      return value >= 1000 ? `${currencySymbol}${(value / 1000).toFixed(0)}k` : `${currencySymbol}${value}`;
                    }
                    return `${currencySymbol}${value.toLocaleString()}`;
                  }}
                  tick={{ fill: '#6b7280', fontSize: window.innerWidth < 640 ? 10 : 12 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  width={window.innerWidth < 640 ? 50 : 60}
                />
                <Tooltip
                  formatter={(value) => [`${currencySymbol}${(value as number).toFixed(2)}`, 'Sales Total']}
                  labelFormatter={formatWeekLabel}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: window.innerWidth < 640 ? '8px' : '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: window.innerWidth < 640 ? '12px' : '14px',
                  }}
                />

                <Legend 
                  wrapperStyle={{ 
                    paddingTop: window.innerWidth < 640 ? '10px' : '20px',
                    fontSize: window.innerWidth < 640 ? '11px' : '12px'
                  }}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#4F46E5" 
                  strokeWidth={window.innerWidth < 640 ? 2 : 3} 
                  dot={{ fill: '#4F46E5', r: window.innerWidth < 640 ? 3 : 5, strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: window.innerWidth < 640 ? 6 : 8, strokeWidth: 2 }} 
                  name="Weekly Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 opacity-50" />
              <p className="text-xs sm:text-sm font-medium">No sales data available</p>
              <p className="text-[10px] sm:text-xs mt-1 text-center px-4">Add your first sale to see trends</p>
            </div>
          )}
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex-shrink-0 bg-rose-50 p-2 sm:p-2.5 rounded-lg sm:rounded-xl">
              <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
            </div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900 truncate">Expense Breakdown</h3>
          </div>
        </div>

        <div className="h-64 sm:h-80">
          {expenseCategoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={expenseDataWithPercentages}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={window.innerWidth < 640 ? 60 : window.innerWidth < 1024 ? 70 : 80}
                  innerRadius={window.innerWidth < 640 ? 30 : 0}
                  fill="#8884d8"
                  paddingAngle={2}
                  labelLine={window.innerWidth >= 640}
                  label={window.innerWidth >= 640 ? (props: { name?: string; percentage?: number }) => {
                    const { name = '', percentage = 0 } = props;
                    return percentage >= 5 ? `${name}: ${percentage.toFixed(0)}%` : '';
                  } : false}
                >
                  {expenseDataWithPercentages.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => {
                    // Find the matching entry to get percentage
                    const entry = expenseDataWithPercentages.find(e => e.value === value);
                    const percentage = entry?.percentage || 0;
                    return [
                      `${currencySymbol}${value.toFixed(2)} (${percentage.toFixed(1)}%)`,
                      'Amount'
                    ];
                  }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: window.innerWidth < 640 ? '8px' : '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: window.innerWidth < 640 ? '11px' : '12px',
                  }}
                />

                <Legend 
                  layout={window.innerWidth < 1024 ? 'horizontal' : 'vertical'}
                  verticalAlign={window.innerWidth < 1024 ? 'bottom' : 'middle'}
                  align={window.innerWidth < 1024 ? 'center' : 'right'}
                  iconType="circle"
                  wrapperStyle={{ 
                    fontSize: window.innerWidth < 640 ? '10px' : '12px',
                    paddingTop: window.innerWidth < 1024 ? '10px' : '0',
                  }}
                  formatter={(value: string) => {
                    // Find the matching entry to get percentage
                    const entry = expenseDataWithPercentages.find(e => e.name === value);
                    const percentage = entry?.percentage || 0;
                    return window.innerWidth < 640 
                      ? `${value.substring(0, 8)}${value.length > 8 ? '...' : ''}`
                      : `${value} (${percentage.toFixed(1)}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 opacity-50" />
              <p className="text-xs sm:text-sm font-medium">No expense data available</p>
              <p className="text-[10px] sm:text-xs mt-1 text-center px-4">Add your first expense to see breakdown</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;