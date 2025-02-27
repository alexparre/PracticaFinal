import React, { useEffect } from 'react';
import { useCurrencyStore } from '../context/CurrencyContext';

const PriceHandler = ({ mainPrice, relatedPrices = [] }) => {
  const { currency, convertPrice } = useCurrencyStore();

  useEffect(() => {
    // Actualizar precio principal
    const mainPriceElement = document.getElementById('course-price');
    if (mainPriceElement) {
      const price = parseFloat(mainPriceElement.getAttribute('data-price') || '0');
      const converted = convertPrice(price);
      mainPriceElement.textContent = `${converted} ${currency}`;
    }

    // Actualizar precios relacionados
    relatedPrices.forEach((_, index) => {
      const element = document.getElementById(`related-price-${index}`);
      if (element) {
        const price = parseFloat(element.getAttribute('data-price') || '0');
        const converted = convertPrice(price);
        element.textContent = `${converted} ${currency}`;
      }
    });
  }, [currency, convertPrice, mainPrice, relatedPrices]);

  return null; // Este componente no renderiza nada, solo maneja los precios
};

export default PriceHandler; 