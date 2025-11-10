'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, Timestamp, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, LogOut, LogIn } from 'lucide-react';

// Custom Components and Types
import StatCard from '@/src/components/ui/StatCard';
import TransactionForm from '@/src/components/TransactionForm';
import { useAuth } from '@/src/context/AuthContext';
import { Sale, Expense, ChartDataPoint, ExpenseCategoryData } from '@/src/types/dashboard';

// --- Constants ---
const EXPENSE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0054', '#8884d8'];

// Utility to approximate ISO Week Number for grouping
const getWeekKey = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const week = Math.floor(dayOfYear / 7);
  return `${year}-${week.toString().padStart(2, '0')}`;
};

// Formats the week key for chart display
const formatWeekLabel = (weekKey: string): string => {
  if (!weekKey) return 'N/A';
  const [year, weekNum] = weekKey.split('-');
  return `W${parseInt(weekNum, 10) + 1} ${year}`;
};

const DashboardPage: React.FC = () => {
  const { user, loading, signIn, signOut } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<'sales' | 'expenses'>('sales');
  const [showForm, setShowForm] = useState(false);

  // --- Data Subscription Effect ---
  useEffect(() => {
    // Return early when user logs out - state will be cleared by the unsubscribe
    if (!user) {
      return;
    }

    const SALES_COLLECTION = `users/${user.uid}/sales_log`;
    const EXPENSES_COLLECTION = `users/${user.uid}/expenses_log`;

    const mapDocToSale = (doc: QueryDocumentSnapshot<DocumentData>): Sale => {
      const data = doc.data();
      return {
        id: doc.id,
        type: 'sale',
        amount: typeof data.amount === 'number' ? data.amount : 0,
        date: typeof data.date === 'string' ? data.date : new Date().toISOString().substring(0, 10),
        userId: typeof data.userId === 'string' ? data.userId : user.uid,
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp : Timestamp.fromDate(new Date()),
      };
    };

    const mapDocToExpense = (doc: QueryDocumentSnapshot<DocumentData>): Expense => {
      const data = doc.data();
      return {
        id: doc.id,
        type: 'expense',
        amount: typeof data.amount === 'number' ? data.amount : 0,
        date: typeof data.date === 'string' ? data.date : new Date().toISOString().substring(0, 10),
        userId: typeof data.userId === 'string' ? data.userId : user.uid,
        category: data.category as Expense['category'] || 'Other',
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp : Timestamp.fromDate(new Date()),
      };
    };

    const unsubscribeSales = onSnapshot(query(collection(db, SALES_COLLECTION)), (snapshot) => {
      const salesData: Sale[] = snapshot.docs.map(mapDocToSale);
      setSales(salesData);
    }, (error) => console.error("Sales Snapshot Error:", error));

    const unsubscribeExpenses = onSnapshot(query(collection(db, EXPENSES_COLLECTION)), (snapshot) => {
      const expensesData: Expense[] = snapshot.docs.map(mapDocToExpense);
      setExpenses(expensesData);
    }, (error) => console.error("Expenses Snapshot Error:", error));

    return () => {
      unsubscribeSales();
      unsubscribeExpenses();
    };
  }, [user]);

  // --- Analytics and Calculations ---
  const { totalSales, totalExpenses, netIncome, weeklySalesData, expenseCategoryData } = useMemo(() => {
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netIncome = totalSales - totalExpenses;

    // Weekly Sales Data
    const salesByWeek = sales.reduce((acc, sale) => {
      const key = getWeekKey(sale.date);
      acc[key] = acc[key] || { week: key, amount: 0 };
      acc[key].amount += sale.amount;
      return acc;
    }, {} as { [key: string]: ChartDataPoint });

    const weeklySalesData = Object.values(salesByWeek).sort((a, b) => {
      // Compare week strings directly - format is YYYY-WW so string comparison works
      if (a.week < b.week) return -1;
      if (a.week > b.week) return 1;
      return 0;
    });

    // Expense Category Data
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Other';
      acc[category] = acc[category] || { name: category, value: 0 };
      acc[category].value += expense.amount;
      return acc;
    }, {} as { [key: string]: ExpenseCategoryData });

    const expenseCategoryData = Object.values(expensesByCategory);

    return { totalSales, totalExpenses, netIncome, weeklySalesData, expenseCategoryData };
  }, [sales, expenses]);

  const handleAddTransaction = useCallback((type: 'sale' | 'expense') => {
    // Convert 'sale' to 'sales' and 'expense' to 'expenses' for activeTab
    setActiveTab(type === 'sale' ? 'sales' : 'expenses');
    setShowForm(false);
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="p-10 bg-white rounded-xl shadow-2xl text-center w-full max-w-md">
          <h1 className="text-3xl font-extrabold text-indigo-800 mb-4">Business Tracker</h1>
          <p className="text-gray-600 mb-8">Sign in with Google to access your dashboard.</p>
          <button
            onClick={signIn}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
          >
            <LogIn className="w-5 h-5 mr-3" /> Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  const listData = activeTab === 'sales' ? sales : expenses;
  const listTitle = activeTab === 'sales' ? 'Sales Log' : 'Expense Log';

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-['Inter']">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-800">
            Welcome, {user.displayName?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tracked Data is private for User ID: <span className="font-semibold text-gray-700">{user.uid}</span>
          </p>
        </div>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300 flex items-center"
        >
          <LogOut className="w-5 h-5 mr-2" /> Sign Out
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Sales Revenue" value={totalSales} />
        <StatCard title="Total Expenses" value={totalExpenses} />
        <StatCard title="Net Income" value={netIncome} isPositive={netIncome >= 0} />
      </div>

      {/* Add Transaction Buttons */}
      <div className="flex justify-start space-x-4 mb-8">
        <button
          onClick={() => { setShowForm(true); setActiveTab('sales'); }}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-[1.03]"
        >
          Add New Sale
        </button>
        <button
          onClick={() => { setShowForm(true); setActiveTab('expenses'); }}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300 transform hover:scale-[1.03]"
        >
          Add New Expense
        </button>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-50 p-6 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {activeTab === 'sales' ? 'Sale' : 'Expense'} Transaction
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>
            <TransactionForm
              type={activeTab === 'sales' ? 'sale' : 'expense'}
              userId={user.uid}
              onAdd={handleAddTransaction}
            />
          </div>
        </div>
      )}

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Sales Trend */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Weekly Sales Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklySalesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="week" tickFormatter={formatWeekLabel} />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${(value as number).toFixed(2)}`, 'Sales Total']} labelFormatter={formatWeekLabel} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} dot={{ fill: '#4F46E5', r: 5 }} activeDot={{ r: 8 }} name="Weekly Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {weeklySalesData.length === 0 && (
            <div className="text-center py-10 text-gray-500 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 mr-2" /> No sales data to display trend.
            </div>
          )}
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Expense Breakdown by Category</h3>
          <div className="h-80">
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
                <Tooltip formatter={(value) => [`$${(value as number).toFixed(2)}`, 'Total Spent']} />
                <Legend layout="vertical" verticalAlign="top" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {expenseCategoryData.length === 0 && (
            <div className="text-center py-10 text-gray-500 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 mr-2" /> No expense data to display breakdown.
            </div>
          )}
        </div>
      </div>

      {/* Transaction Log */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-8">
        <div className="flex space-x-4 border-b mb-4">
          <button
            className={`py-2 px-4 text-sm font-semibold transition-colors duration-200 ${activeTab === 'sales' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
            onClick={() => setActiveTab('sales')}
          >
            Sales Log ({sales.length})
          </button>
          <button
            className={`py-2 px-4 text-sm font-semibold transition-colors duration-200 ${activeTab === 'expenses' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
            onClick={() => setActiveTab('expenses')}
          >
            Expenses Log ({expenses.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                {activeTab === 'expenses' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listData.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()).map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">${item.amount.toFixed(2)}</td>
                  {activeTab === 'expenses' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {(item as Expense).category}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
              {listData.length === 0 && (
                <tr>
                  <td colSpan={activeTab === 'expenses' ? 3 : 2} className="px-6 py-4 text-center text-gray-500">
                    No {listTitle.toLowerCase()} recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;