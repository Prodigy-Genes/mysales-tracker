import React, { useEffect } from 'react';
import { X, Receipt, CreditCard } from 'lucide-react';
import TransactionForm from '@/src/components/TransactionForm';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'sale' | 'expense';
  userId: string;
  onAdd: (type: 'sale' | 'expense') => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, type, userId, onAdd }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`px-6 py-5 border-b border-gray-100 bg-gradient-to-r ${
          type === 'sale' ? 'from-emerald-50 to-emerald-100/50' : 'from-rose-50 to-rose-100/50'
        } rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${
                type === 'sale' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}>
                {type === 'sale' ? (
                  <Receipt className="w-5 h-5 text-white" />
                ) : (
                  <CreditCard className="w-5 h-5 text-white" />
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Add New {type === 'sale' ? 'Sale' : 'Expense'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all duration-200 transform hover:scale-110 active:scale-95"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <TransactionForm
            type={type}
            userId={userId}
            onAdd={onAdd}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;