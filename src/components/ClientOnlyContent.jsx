import React, { useState, useEffect } from 'react';
import useUserStore from '../utils/useUserStore';

function ClientOnlyContent({ course }) {
  const { user } = useUserStore();
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false); // Estado del diálogo de carrito

  useEffect(() => {
    if (user) {
      setHasAccess(user?.purchasedCourses?.includes(course.tag));
    }
  }, [user, course.tag]);

  const addToCart = () => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const isAlreadyInCart = storedCart.some((item) => item.id === course.id);

    if (!isAlreadyInCart) {
      const updatedCart = [...storedCart, course];
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      // Emitir un evento personalizado
      const cartUpdatedEvent = new Event('cartUpdated');
      window.dispatchEvent(cartUpdatedEvent);

      // 🔥 Abrir el modal de "Producto añadido"
      setIsCartDialogOpen(true);

      // 🔥 Cerrar el modal automáticamente después de 2.5 segundos
      setTimeout(() => {
        setIsCartDialogOpen(false);
      }, 2500);
    } else {
      alert('Este curso ya está en tu carrito.');
    }
  };

  return (
    <div className="flex justify-center">
      {hasAccess ? (
        <div>
          <div className="flex flex-col items-center justify-center h-full w-full text-center">
           <h2 className="text-xl font-bold mb-4">🎥 Contenido del Curso: {course.title}</h2>
           <button onClick={() => setIsVideoDialogOpen(true)}  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
           >  Ver Video
          </button>
        </div>


          {isVideoDialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <iframe
                  width="560"
                  height="315"
                  src={course.url}
                  title="Video del curso"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                <div className='flex justify-end'>
                <button
                  onClick={() => setIsVideoDialogOpen(false)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Cerrar Video
                </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-gray-700">🔒 Debes comprar este curso para verlo.</p>
          <button
            onClick={addToCart}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Añadir al Carrito
          </button>

          {/* 🔥 Diálogo de Producto Añadido al Carrito */}
          {isCartDialogOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-300 text-center w-80">
                <h2 className="text-xl font-bold text-green-600">¡Añadido al Carrito! 🛒</h2>
                <p className="text-gray-600 mt-2">
                  El curso <strong>{course.title}</strong> ha sido agregado a tu carrito.
                </p>
                <button
                  onClick={() => setIsCartDialogOpen(false)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClientOnlyContent;
