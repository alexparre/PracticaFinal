import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Crear un evento personalizado para cambios de moneda
const CURRENCY_CHANGE_EVENT = 'CURRENCY_CHANGE';

const broadcastCurrencyChange = (currency) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CURRENCY_CHANGE_EVENT, { detail: currency }));
  }
};

const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: '€',
      setCurrency: (newCurrency) => {
        set({ currency: newCurrency });
        broadcastCurrencyChange(newCurrency);
        
        // También guardar en localStorage directamente
        if (typeof window !== 'undefined') {
          localStorage.setItem('current-currency', newCurrency);
        }
      },
      convertPrice: (price) => {
        const { currency } = get();
        if (!price) return '0.00';
        const numericPrice = parseFloat(price);
        if (currency === '€') return numericPrice.toFixed(2);
        const conversionRate = 0.86; // EUR a GBP
        return (numericPrice * conversionRate).toFixed(2);
      },
      getCurrentCurrency: () => get().currency,
    }),
    {
      name: 'currency-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currency: state.currency }),
    }
  )
);

// Inicializar con el valor guardado en localStorage si existe
if (typeof window !== 'undefined') {
  const savedCurrency = localStorage.getItem('current-currency');
  if (savedCurrency) {
    useCurrencyStore.getState().setCurrency(savedCurrency);
  }
}

export { useCurrencyStore, CURRENCY_CHANGE_EVENT }; 