import React from 'react';
import { useCurrencyStore } from '../context/CurrencyContext';

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrencyStore();

  const toggleCurrency = () => {
    const newCurrency = currency === '€' ? '$' : '€';
    setCurrency(newCurrency);
  };

  return (
    <button
      onClick={toggleCurrency}
      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      {currency}
    </button>
  );
};

export default CurrencySelector; 