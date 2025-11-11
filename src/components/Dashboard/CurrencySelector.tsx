'use client';

import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const AVAILABLE_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

interface CurrencySelectorProps {
  onCurrencyChange: (currency: { code: string; symbol: string }) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ onCurrencyChange }) => {
  // Lazy initialize from localStorage (avoids running setState in useEffect)
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('selectedCurrency') : null;
    return saved ? JSON.parse(saved) : { code: 'GHS', symbol: '₵' };
  });

  // Sync parent once currency is known
  useEffect(() => {
    onCurrencyChange(selectedCurrency);
  }, [selectedCurrency, onCurrencyChange]);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = AVAILABLE_CURRENCIES.find(c => c.code === e.target.value)!;
    setSelectedCurrency(newCurrency);
    localStorage.setItem('selectedCurrency', JSON.stringify(newCurrency));
  };

  return (
    <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm hover:shadow-md transition-all">
      <Globe className="w-4 h-4 text-gray-600" />
      <select
        title='Currency Change'
        value={selectedCurrency.code}
        onChange={handleCurrencyChange}
        className="bg-transparent focus:outline-none text-sm text-gray-700"
      >
        {AVAILABLE_CURRENCIES.map(currency => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} — {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
