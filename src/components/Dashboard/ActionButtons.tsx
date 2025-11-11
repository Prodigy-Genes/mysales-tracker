import React from 'react';
import { Plus, Receipt, CreditCard } from 'lucide-react';

interface ActionButtonsProps {
  onAddSale: () => void;
  onAddExpense: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAddSale, onAddExpense }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-start gap-4 mb-8 animate-in">
      <button
        onClick={onAddSale}
        className="group relative px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <div className="relative flex items-center justify-center space-x-2">
          <div className="bg-white bg-opacity-20 p-1.5 rounded-lg">
            <Receipt className="w-5 h-5" />
          </div>
          <span>Add New Sale</span>
          <Plus className="w-4 h-4 ml-1" />
        </div>
      </button>

      <button
        onClick={onAddExpense}
        className="group relative px-6 py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <div className="relative flex items-center justify-center space-x-2">
          <div className="bg-white bg-opacity-20 p-1.5 rounded-lg">
            <CreditCard className="w-5 h-5" />
          </div>
          <span>Add New Expense</span>
          <Plus className="w-4 h-4 ml-1" />
        </div>
      </button>
    </div>
  );
};

export default ActionButtons;