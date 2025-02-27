import React from 'react';
import { useCurrencyStore } from '../context/CurrencyContext';

export const CurrencyWrapper = ({ children }) => {
  // Inicializar el store de Zustand
  useCurrencyStore();
  return <>{children}</>;
};

export default CurrencyWrapper; 