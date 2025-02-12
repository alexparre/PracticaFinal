import React, { useState, useEffect } from "react";
import { ref, push, get } from "firebase/database";
import { db } from "../utils/firebaseConfig";
import useUserStore from "../utils/useUserStore"; // Importar Zustand

const AddReviewForm = ({ courseId, onReviewAdded }) => {
  const { user, updateUser } = useUserStore(); // 🔥 Obtener el usuario desde Zustand
  const [hasPurchased, setHasPurchased] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [courseTag, setCourseTag] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    if (user) {
      const courseRef = ref(db, `courses/${courseId}`);
      get(courseRef).then((snapshot) => {
        if (snapshot.exists()) {
          const courseData = snapshot.val();
          setCourseTag(courseData.tag);

          if (user.purchasedCourses?.includes(courseData.tag)) {
            setHasPurchased(true);
          }

          if (courseData.reviews) {
            const userHasReviewed = Object.values(courseData.reviews).some(
              (review) => review.userName === user.name
            );
            setHasReviewed(userHasReviewed);
          }
        } else {
          console.error("No se encontró el curso en la base de datos.");
        }
      });
    }
  }, [courseId, user]); // 🔥 Ahora se ejecuta cuando el usuario cambia en Zustand

  const handleSubmit = async () => {
    setShowDialog(false);
    setLoading(true);

    try {
      const newReview = {
        userName: user.name,
        userPicture: user.profilePicture,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };

      const reviewsRef = ref(db, `courses/${courseId}/reviews`);
      await push(reviewsRef, newReview);

      setRating(5);
      setComment("");
      setHasReviewed(true);

      // 🔥 Actualizar Zustand para reflejar la reseña en tiempo real
      const updatedUser = {
        ...user,
        reviews: {
          ...(user.reviews || {}),
          [courseId]: newReview,
        },
      };
      updateUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      onReviewAdded();
    } catch (error) {
      console.error("Error al añadir la reseña:", error);
      alert("Hubo un error al enviar la reseña. Por favor, inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!hasPurchased) {
      alert("Debes haber comprado este curso para dejar una reseña.");
      return;
    }
    if (!comment.trim()) {
      alert("Por favor, escribe un comentario.");
      return;
    }
    if (!user) {
      alert("Debes iniciar sesión para añadir una reseña.");
      return;
    }
    if (hasReviewed) {
      alert("Ya has dejado una reseña para este curso.");
      return;
    }
    setShowDialog(true);
  };

  return (
    <>
      <form className="bg-white shadow-md rounded-lg p-6 mt-8" onSubmit={handleConfirmSubmit}>
        <h2 className="text-xl font-bold mb-4">Añadir una reseña</h2>

        {user ? (
          <div className="mb-4 flex items-center">
            <img src={user.profilePicture} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
            <p className="font-bold">{user.name}</p>
          </div>
        ) : (
          <p className="text-red-500 mb-4">Por favor, inicia sesión para añadir una reseña.</p>
        )}

        {!hasPurchased && user ? (
          <p className="text-red-500 mb-4">
            Solo los estudiantes que han comprado este curso pueden dejar una reseña.
          </p>
        ) : hasReviewed ? (
          <p className="text-blue-500 mb-4">Ya has dejado una reseña para este curso. No puedes añadir otra.</p>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                Calificación (*)
              </label>
              <select
                id="rating"
                className="shadow appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((rate) => (
                  <option key={rate} value={rate}>
                    {rate} Estrella{rate > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
                Comentario (*)
              </label>
              <textarea
                id="comment"
                className="shadow appearance-none border rounded w-[600px] h-[150px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe tu reseña"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className={`bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading || !user || !hasPurchased || hasReviewed}
            >
              {loading ? "Enviando..." : "Enviar Reseña"}
            </button>
          </>
        )}
      </form>

      {showDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">¿Estás seguro de que deseas enviar esta reseña?</p>
            <div className="flex justify-end">
              <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={() => setShowDialog(false)}>
                Cancelar
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddReviewForm;
