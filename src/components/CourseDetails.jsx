import React, { useState, useEffect } from 'react';

// Componente que muestra los detalles del curso
const CourseDetails = ({ course }) => {
  // Estado para el carrito
  const [cart, setCart] = useState([]);

  // Efecto para cargar el carrito desde localStorage cuando el componente se monta
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  // Función para añadir el curso al carrito
  const addToCart = () => {
    // Comprobamos si el curso ya está en el carrito
    const existingCourse = cart.find(item => item.id === course.id);
    if (!existingCourse) {
      // Si no está, lo añadimos
      const updatedCart = [...cart, course];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart)); // Guardamos el carrito en localStorage
    }
  };

  return (
    <div className="mt-8 text-center">
      <p>Debes comprar este curso para acceder a su contenido.</p>
      <button
        onClick={addToCart}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-4"
      >
        Añadir al carrito
      </button>
    </div>
  );
};

export default CourseDetails;
