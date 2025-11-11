'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, Timestamp, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

// Component Imports
import AuthScreen from '@/src/components/Dashboard/AuthScreen';
import DashboardHeader from '@/src/components/Dashboard/DashboardHeader';
import StatsSection from '@/src/components/Dashboard/StatSection';
import ActionButtons from '@/src/components/Dashboard/ActionButtons';
import ChartsSection from '@/src/components/Dashboard/ChartsSection';
import TransactionLog from '@/src/components/Dashboard/TransactionLog';
import TransactionModal from '@/src/components/Dashboard/TransactionModal';

// Context and Types
import { useAuth } from '@/src/context/AuthContext';
import { Sale, Expense, ChartDataPoint, ExpenseCategoryData } from '@/src/types/dashboard';

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

const DashboardPage: React.FC = () => {
  const { user, loading, signIn, signOut } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<'sales' | 'expenses'>('sales');
  const [showForm, setShowForm] = useState(false);

  // --- Data Subscription Effect ---
  useEffect(() => {
    if (!user) return;

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

  // --- Event Handlers ---
  const handleAddTransaction = useCallback((type: 'sale' | 'expense') => {
    setActiveTab(type === 'sale' ? 'sales' : 'expenses');
    setShowForm(false);
  }, []);

  const handleOpenModal = useCallback((type: 'sales' | 'expenses') => {
    setActiveTab(type);
    setShowForm(true);
  }, []);

  const handleTabChange = useCallback((tab: 'sales' | 'expenses') => {
    setActiveTab(tab);
  }, []);

  // Loading state
  if (loading) return null;

  // Auth screen
  if (!user) {
    return <AuthScreen onSignIn={signIn} />;
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8 font-['Inter']">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          userName={user.displayName}
          userId={user.uid}
          onSignOut={signOut}
        />

        <StatsSection
          totalSales={totalSales}
          totalExpenses={totalExpenses}
          netIncome={netIncome}
        />

        <ActionButtons
          onAddSale={() => handleOpenModal('sales')}
          onAddExpense={() => handleOpenModal('expenses')}
        />

        <ChartsSection
          weeklySalesData={weeklySalesData}
          expenseCategoryData={expenseCategoryData}
        />

        <TransactionLog
          activeTab={activeTab}
          onTabChange={handleTabChange}
          sales={sales}
          expenses={expenses}
        />

        <TransactionModal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          type={activeTab === 'sales' ? 'sale' : 'expense'}
          userId={user.uid}
          onAdd={handleAddTransaction}
        />
      </div>
    </div>
  );
};

export default DashboardPage;