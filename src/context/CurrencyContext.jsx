import { create } from 'zustand';

const useCurrencyStore = create((set) => ({
  currency: localStorage.getItem('selectedCurrency') || '€',
  setCurrency: (newCurrency) => {
    localStorage.setItem('selectedCurrency', newCurrency);
    set({ currency: newCurrency });
  },
  convertPrice: (price) => {
    const currentCurrency = localStorage.getItem('selectedCurrency') || '€';
    const conversionRate = 0.83; // Tasa de conversión EUR a USD
    return currentCurrency === '€' ? price : (price * conversionRate).toFixed(2);
  }
}));

export { useCurrencyStore }; 