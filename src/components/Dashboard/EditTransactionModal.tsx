import React, { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { Sale, Expense } from '@/src/types/dashboard';
import { updateSale, updateExpense } from '@/src/utils/firestoreOperations';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Sale | Expense;
  userId: string;
  onSuccess: () => void;
}

const EXPENSE_CATEGORIES = ['Marketing', 'Operations', 'Salaries', 'Inventory', 'Utilities', 'Other'];

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  userId,
  onSuccess,
}) => {
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [date, setDate] = useState(transaction.date);
  const [category, setCategory] = useState((transaction as Expense).category || 'Other');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isExpense = transaction.type === 'expense';

  useEffect(() => {
    if (isOpen) {
      setAmount(transaction.amount.toString());
      setDate(transaction.date);
      setCategory((transaction as Expense).category || 'Other');
      setError('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        amount: numAmount,
        date,
        ...(isExpense && { category }),
      };

      if (isExpense) {
        await updateExpense(userId, transaction.id, updateData);
      } else {
        await updateSale(userId, transaction.id, updateData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to update transaction. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`px-6 py-5 border-b border-gray-100 bg-gradient-to-r ${
          isExpense ? 'from-amber-50 to-amber-100/50' : 'from-blue-50 to-blue-100/50'
        } rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${
                isExpense ? 'bg-amber-500' : 'bg-blue-500'
              }`}>
                <Edit3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Edit {isExpense ? 'Expense' : 'Sale'}
              </h2>
            </div>
            <button
              title='Close Modal'
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0.01"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>

            {/* Date Input */}
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Select (only for expenses) */}
            {isExpense && (
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Expense['category']) }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;