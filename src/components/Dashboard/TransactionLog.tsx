import React, { useState } from 'react';
import { FileText, Receipt, CreditCard, Calendar, DollarSign, Tag, Edit2, Trash2 } from 'lucide-react';
import { Sale, Expense } from '@/src/types/dashboard';
import { deleteSale, deleteExpense } from '@/src/utils/firestoreOperations';

interface TransactionLogProps {
  activeTab: 'sales' | 'expenses';
  onTabChange: (tab: 'sales' | 'expenses') => void;
  sales: Sale[];
  expenses: Expense[];
  userId: string;
  onEdit: (transaction: Sale | Expense) => void;
  currencySymbol?: string;
}

const TransactionLog: React.FC<TransactionLogProps> = ({ 
  activeTab, 
  onTabChange, 
  sales, 
  expenses,
  userId,
  onEdit,
  currencySymbol = '₵'
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const listData = activeTab === 'sales' ? sales : expenses;
  const sortedData = [...listData].sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'Marketing': 'bg-purple-100 text-purple-700 border-purple-200',
      'Operations': 'bg-blue-100 text-blue-700 border-blue-200',
      'Salaries': 'bg-green-100 text-green-700 border-green-200',
      'Inventory': 'bg-amber-100 text-amber-700 border-amber-200',
      'Utilities': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'Other': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[category] || colors['Other'];
  };

  const handleDelete = async (transaction: Sale | Expense) => {
    if (!confirm(`Are you sure you want to delete this ${transaction.type}?`)) {
      return;
    }

    setDeletingId(transaction.id);
    
    try {
      if (transaction.type === 'sale') {
        await deleteSale(userId, transaction.id);
      } else {
        await deleteExpense(userId, transaction.id);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in mx-4 sm:mx-0">
      {/* Tab Header */}
      <div className="border-b border-gray-100 bg-gray-50 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className={`relative flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-all duration-300 ${
              activeTab === 'sales'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
            onClick={() => onTabChange('sales')}
          >
            <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">Sales</span>
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                activeTab === 'sales' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'
              }`}>
                {sales.length}
              </span>
            </div>
          </button>

          <button
            className={`relative flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-all duration-300 ${
              activeTab === 'expenses'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
            onClick={() => onTabChange('expenses')}
          >
            <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">Expenses</span>
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                activeTab === 'expenses' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'
              }`}>
                {expenses.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        {sortedData.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Date</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Amount</span>
                  </div>
                </th>
                {activeTab === 'expenses' && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4" />
                      <span>Category</span>
                    </div>
                  </th>
                )}
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sortedData.map((item, index) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-indigo-50/50 transition-colors duration-150 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${activeTab === 'sales' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                        {activeTab === 'sales' ? (
                          <Receipt className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{formatDate(item.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${
                      activeTab === 'sales' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {currencySymbol}{item.amount.toFixed(2)}
                    </span>
                  </td>
                  {activeTab === 'expenses' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex items-center text-xs font-semibold rounded-lg border ${getCategoryColor((item as Expense).category)}`}>
                        {(item as Expense).category}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                        disabled={deletingId === item.id}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-base font-semibold text-gray-900 mb-1">
              No {activeTab === 'sales' ? 'sales' : 'expenses'} recorded yet
            </p>
            <p className="text-sm text-gray-500">
              Start by adding your first {activeTab === 'sales' ? 'sale' : 'expense'} transaction
            </p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {sortedData.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {sortedData.map((item, index) => (
              <div 
                key={item.id}
                className="p-4 hover:bg-indigo-50/50 transition-colors duration-150"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${activeTab === 'sales' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                      {activeTab === 'sales' ? (
                        <Receipt className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <CreditCard className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{formatDateShort(item.date)}</span>
                        <span className={`text-base font-bold whitespace-nowrap ${
                          activeTab === 'sales' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {currencySymbol}{item.amount.toFixed(2)}
                        </span>
                      </div>
                      {activeTab === 'expenses' && (
                        <span className={`inline-flex items-center px-2 py-1 text-[10px] font-semibold rounded-md border ${getCategoryColor((item as Expense).category)}`}>
                          {(item as Expense).category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors active:scale-95"
                      title="Edit"
                      disabled={deletingId === item.id}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 active:scale-95"
                      title="Delete"
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-gray-50 p-3 rounded-full mb-3">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1 text-center">
              No {activeTab === 'sales' ? 'sales' : 'expenses'} recorded yet
            </p>
            <p className="text-xs text-gray-500 text-center">
              Start by adding your first {activeTab === 'sales' ? 'sale' : 'expense'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionLog;