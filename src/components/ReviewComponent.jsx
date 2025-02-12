import React, { useEffect, useState } from "react";
import { ref, query, orderByKey, get } from "firebase/database";
import { db } from "../utils/firebaseConfig";
import AddReviewForm from "./AddReview";

const ReviewComponent = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const reviewsRef = query(ref(db, `courses/${courseId}/reviews`), orderByKey());
      const snapshot = await get(reviewsRef);

      if (snapshot.exists()) {
        setReviews(Object.values(snapshot.val()));
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error al cargar las reseñas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  if (loading) {
    return <p>Cargando reseñas...</p>;
  }

  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6">Reseñas del curso</h2>
        {reviews.length === 0 ? (
          <p className="text-lg text-gray-700">No hay reseñas disponibles para este curso.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="mb-8 border-b-2 pb-6">
              <div className="flex items-center space-x-6">
                <img
                  src={review.userPicture}
                  alt={review.userName}
                  className="w-16 h-16 rounded-full shadow-md"
                />
                <div>
                  <p className="font-semibold text-xl">{review.userName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-lg text-gray-800">{review.comment}</p>
              <p className="mt-2 text-yellow-500 text-lg">
                {"★".repeat(review.rating)}{" "}
                {"☆".repeat(5 - review.rating)}
              </p>
            </div>
          ))
        )}
      </div>
  
      <AddReviewForm courseId={courseId} onReviewAdded={fetchReviews} />
    </div>
  );
}  

export default ReviewComponent;
