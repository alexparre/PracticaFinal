import React, { useState, useEffect } from 'react';
import useUserStore from '../utils/useUserStore'; 
import { db } from '../utils/firebaseConfig';
import { ref, update, get } from 'firebase/database';
import { useCurrencyStore } from '../context/CurrencyContext';
import CurrencyWrapper from './CurrencyWrapper';

const CartIconContent = () => {
  const { user, updatePurchasedCourses } = useUserStore();
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [total, setTotal] = useState(0);
  const { currency, setCurrency, convertPrice } = useCurrencyStore();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);

    const calculateTotal = (cartItems) =>
      cartItems.reduce((acc, course) => acc + (course.price || 0), 0);

    setTotal(calculateTotal(storedCart));

    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(updatedCart);
      setTotal(calculateTotal(updatedCart));
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const removeFromCart = (courseId) => {
    const updatedCart = cart.filter((course) => course.id !== courseId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    setTotal(updatedCart.reduce((acc, course) => acc + (course.price || 0), 0));
  };

  const handleCheckout = async () => { 
    try {
      if (!user || cart.length === 0) {
        alert('Debes iniciar sesión y agregar cursos al carrito.');
        return;
      }

      const purchasedTags = cart.map((course) => course.tag);
      const userRef = ref(db, `users/user${user.id}`);

      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (!userData) {
        console.error('No se encontró el usuario en Firebase.');
        return;
      }

      const currentPurchasedCourses = new Set(userData.purchasedCourses || []);
      const newCourses = purchasedTags.filter(course => !currentPurchasedCourses.has(course));

      if (newCourses.length === 0) {
        alert('Ya compraste estos cursos.');
        return;
      }

      const updatedPurchasedCourses = [...currentPurchasedCourses, ...newCourses];

      await update(userRef, { purchasedCourses: updatedPurchasedCourses });

      updatePurchasedCourses(newCourses);

      const updatedUser = { ...user, purchasedCourses: updatedPurchasedCourses };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      localStorage.setItem('cart', JSON.stringify([]));
      setCart([]);
      setTotal(0); 
      setIsPurchased(true);
    } catch (error) {
      console.error('Error al procesar la compra:', error);
    }
  };

  return (
    <div className="relative">
    <button onClick={() => setIsModalOpen(true)} className="relative text-white">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34">
        <rect x="6" y="17" width="2" height="2" fill="white" />
        <rect x="16" y="17" width="2" height="2" fill="white" />
        <path
          d="M5 3H3v2h2l3.6 9.2c.1.2.3.3.5.3H17c.3 0 .5-.2.6-.5l2-7c.1-.3 0-.5-.1-.7-.1-.1-.3-.2-.5-.2H6.2L5 3zm2 8h9.8l-1.2 5H9.4L7 11z"
          fill="white"
        />
      </svg>
      {cart.length > 0 && (
        <span className="absolute top-0 right-0 -mt-1 -mr-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1">
          {cart.length}
        </span>
      )}
    </button>

    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-[90%] sm:w-[600px] p-6 relative">
          {!isPurchased ? (
            <>
              <h2 className="text-2xl text-gray-900 font-bold mb-4 text-center border-b pb-4">
                Carrito de Compras
              </h2>
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">Tu carrito está vacío.</p>
              ) : (
                <>
                  <ul className="space-y-4">
                    {cart.map((course) => (
                      <li
                        key={course.id}
                        className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm"
                      >
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover shadow-md"
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 truncate">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {course.description.substring(0, 50)}...
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-red-600">
                            {convertPrice(course.price)} {currency}
                          </p>
                          <button
                            onClick={() => removeFromCart(course.id)}
                            className="text-sm text-gray-500 hover:text-red-600 mt-1 transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t pt-2 text-right">
                    <p className="text-lg font-bold text-gray-800">
                      Total: <span className="text-red-600">{convertPrice(total)} {currency}</span>
                    </p>
                  </div>
                </>
              )}
              <div className="mt-10 flex justify-between">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Cerrar
                </button>
                {cart.length > 0 && (
                  <button
                    onClick={handleCheckout}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition"
                  >
                    Pagar
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl text-green-600 font-bold mb-4">¡Gracias por tu compra!</h2>
              <p className="text-gray-700">Ya puedes empezar a ver el contenido del curso.</p>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);
};

const CartIcon = () => {
  return (
    <CurrencyWrapper>
      <CartIconContent />
    </CurrencyWrapper>
  );
};

export default CartIcon;
