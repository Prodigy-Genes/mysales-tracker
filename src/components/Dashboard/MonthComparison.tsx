import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar, Award, AlertTriangle, DollarSign } from 'lucide-react';
import { Sale, Expense } from '@/src/types/dashboard';

interface MonthComparisonProps {
  sales: Sale[];
  expenses: Expense[];
  currencySymbol?: string;
}

interface MonthData {
  month: string;
  year: number;
  sales: number;
  expenses: number;
  netIncome: number;
  salesCount: number;
  expensesCount: number;
}

const MonthComparison: React.FC<MonthComparisonProps> = ({ sales, expenses, currencySymbol = '₵'  }) => {
  const monthData = useMemo(() => {
    const dataByMonth: { [key: string]: MonthData } = {};

    // Process sales
    sales.forEach((sale) => {
      const date = new Date(sale.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!dataByMonth[key]) {
        dataByMonth[key] = {
          month: monthName,
          year: date.getFullYear(),
          sales: 0,
          expenses: 0,
          netIncome: 0,
          salesCount: 0,
          expensesCount: 0,
        };
      }

      dataByMonth[key].sales += sale.amount;
      dataByMonth[key].salesCount += 1;
    });

    // Process expenses
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!dataByMonth[key]) {
        dataByMonth[key] = {
          month: monthName,
          year: date.getFullYear(),
          sales: 0,
          expenses: 0,
          netIncome: 0,
          salesCount: 0,
          expensesCount: 0,
        };
      }

      dataByMonth[key].expenses += expense.amount;
      dataByMonth[key].expensesCount += 1;
    });

    // Calculate net income
    Object.values(dataByMonth).forEach((data) => {
      data.netIncome = data.sales - data.expenses;
    });

    return Object.values(dataByMonth);
  }, [sales, expenses]);

  const { bestMonth, worstMonth } = useMemo(() => {
    if (monthData.length === 0) {
      return { bestMonth: null, worstMonth: null };
    }

    const sorted = [...monthData].sort((a, b) => b.netIncome - a.netIncome);
    return {
      bestMonth: sorted[0],
      worstMonth: sorted[sorted.length - 1],
    };
  }, [monthData]);

  const formatCurrency = (value: number): string => {
  return `${currencySymbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

  if (monthData.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center animate-in">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Monthly Data Yet</h3>
        <p className="text-sm text-gray-500">Start adding transactions to see month comparisons</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-in">
      {/* Best Month Card */}
      {bestMonth && (
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl shadow-sm border border-emerald-200 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-500 p-3 rounded-xl shadow-md">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Best Month</h3>
                <p className="text-sm text-emerald-700 font-medium">{bestMonth.month}</p>
              </div>
            </div>
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>

          <div className="space-y-4">
            {/* Net Income */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Net Income</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-emerald-600">
                {formatCurrency(bestMonth.netIncome)}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl">
                <p className="text-xs font-medium text-gray-600 mb-1">Total Sales</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(bestMonth.sales)}</p>
                <p className="text-xs text-gray-500 mt-1">{bestMonth.salesCount} transactions</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl">
                <p className="text-xs font-medium text-gray-600 mb-1">Total Expenses</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(bestMonth.expenses)}</p>
                <p className="text-xs text-gray-500 mt-1">{bestMonth.expensesCount} transactions</p>
              </div>
            </div>

            {/* Profit Margin */}
            <div className="bg-emerald-600 text-white p-3 rounded-xl">
              <p className="text-xs font-medium mb-1">Profit Margin</p>
              <p className="text-xl font-bold">
                {bestMonth.sales > 0 ? ((bestMonth.netIncome / bestMonth.sales) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Worst Month Card */}
      {worstMonth && (
        <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-6 rounded-2xl shadow-sm border border-rose-200 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-rose-500 p-3 rounded-xl shadow-md">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Needs Improvement</h3>
                <p className="text-sm text-rose-700 font-medium">{worstMonth.month}</p>
              </div>
            </div>
            <TrendingDown className="w-6 h-6 text-rose-600" />
          </div>

          <div className="space-y-4">
            {/* Net Income */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Net Income</span>
                <DollarSign className="w-4 h-4 text-rose-600" />
              </div>
              <p className={`text-3xl font-bold ${worstMonth.netIncome >= 0 ? 'text-gray-900' : 'text-rose-600'}`}>
                {formatCurrency(worstMonth.netIncome)}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl">
                <p className="text-xs font-medium text-gray-600 mb-1">Total Sales</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(worstMonth.sales)}</p>
                <p className="text-xs text-gray-500 mt-1">{worstMonth.salesCount} transactions</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl">
                <p className="text-xs font-medium text-gray-600 mb-1">Total Expenses</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(worstMonth.expenses)}</p>
                <p className="text-xs text-gray-500 mt-1">{worstMonth.expensesCount} transactions</p>
              </div>
            </div>

            {/* Areas to Improve */}
            <div className="bg-rose-600 text-white p-3 rounded-xl">
              <p className="text-xs font-medium mb-1">
                {worstMonth.netIncome < 0 ? 'Loss Amount' : 'Profit Margin'}
              </p>
              <p className="text-xl font-bold">
                {worstMonth.netIncome < 0
                  ? formatCurrency(Math.abs(worstMonth.netIncome))
                  : worstMonth.sales > 0
                  ? `${((worstMonth.netIncome / worstMonth.sales) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthComparison;