'use client';

import React, { useState } from 'react';
import { DollarSign, Calendar, Tag, Loader } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ExpenseCategory, Sale, Expense } from '../types/dashboard'; // <-- import your types

// Only valid ExpenseCategory values
const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food', 'Transport', 'Utilities', 'Shopping', 'Entertainment',
  'Rent', 'Payroll', 'Supplies', 'Marketing', 'Other'
];

// Form input helper
interface FormInputProps {
  label: string;
  type?: 'text' | 'number' | 'date' | 'select';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: string[];
  Icon: React.ElementType;
  placeholder?: string;
  id?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, type = 'text', value, onChange, options = [], Icon, placeholder, id }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
      <Icon className="w-4 h-4 mr-2 text-indigo-500" />
      {label}
    </label>
    {type === 'select' ? (
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg shadow-sm"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    )}
  </div>
);

interface TransactionFormProps {
  type: 'sale' | 'expense';
  userId: string;
  onAdd: (type: 'sale' | 'expense') => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, userId, onAdd }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [category, setCategory] = useState<ExpenseCategory>(EXPENSE_CATEGORIES[0]);
  const [isAdding, setIsAdding] = useState(false);

  const collectionPath = type === 'sale' ? `users/${userId}/sales_log` : `users/${userId}/expenses_log`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !amount || parseFloat(amount) <= 0) return;

    setIsAdding(true);

    try {
      if (type === 'sale') {
        const saleDoc: Omit<Sale, 'id'> = {
          type: 'sale',
          amount: parseFloat(amount),
          date,
          userId,
          timestamp: serverTimestamp() as unknown as Timestamp, // cast safe for Firestore
        };
        await addDoc(collection(db, collectionPath), saleDoc);
      } else {
        const expenseDoc: Omit<Expense, 'id'> = {
          type: 'expense',
          amount: parseFloat(amount),
          date,
          userId,
          category,
          timestamp: serverTimestamp() as unknown as Timestamp,
        };
        await addDoc(collection(db, collectionPath), expenseDoc);
      }

      // Reset form
      setAmount('');
      setDate(new Date().toISOString().substring(0, 10));
      setCategory(EXPENSE_CATEGORIES[0]);
      onAdd(type);
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
    } finally {
      setIsAdding(false);
    }
  };

  const title = type === 'sale' ? 'Record New Sale' : 'Record New Expense';
  const buttonText = type === 'sale' ? 'Add Sale' : 'Add Expense';

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          Icon={DollarSign}
          placeholder="e.g., 150.00"
          id="amount"
        />
        <FormInput
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          Icon={Calendar}
          id="date"
        />
        {type === 'expense' && (
          <FormInput
            label="Category"
            type="select"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            options={EXPENSE_CATEGORIES}
            Icon={Tag}
            placeholder="Select a category"
            id="category"
          />
        )}
        <button
          type="submit"
          disabled={isAdding || !amount || parseFloat(amount) <= 0 || (type === 'expense' && !category)}
          className={`w-full py-2 px-4 rounded-lg font-bold text-white transition duration-300 shadow-md ${
            isAdding || !amount || parseFloat(amount) <= 0 ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
          } flex items-center justify-center`}
        >
          {isAdding ? <Loader className="w-5 h-5 animate-spin mr-2" /> : <DollarSign className="w-5 h-5 mr-2" />}
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
