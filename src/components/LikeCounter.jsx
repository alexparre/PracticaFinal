import { useState, useEffect } from 'react';
import { ref, onValue, update, get, remove } from 'firebase/database';
import { db } from '../utils/firebaseConfig';

export default function LikeCounter({ courseID, userID }) {
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);

  useEffect(() => {
    // Reference to the likes count
    const likesRef = ref(db, `courses/${courseID}/likes`);
    
    // Listener to update the likes count
    const unsubscribe = onValue(likesRef, (snapshot) => {
      setLikes(snapshot.val() || 0);
    });

    // Check if the user has already liked the course
    const userLikeRef = ref(db, `courses/${courseID}/userLikes/${userID}`);
    get(userLikeRef).then((snapshot) => {
      if (snapshot.exists()) {
        setUserLiked(true);
      } else {
        setUserLiked(false);
      }
    });

    return () => unsubscribe();
  }, [courseID, userID]);

  const handleLikeToggle = () => {
    const likesRef = ref(db, `courses/${courseID}`);
    const userLikeRef = ref(db, `courses/${courseID}/userLikes/${userID}`);

    if (userLiked) {
      // If the user already liked, remove their like
      update(likesRef, { likes: likes - 1 });
      remove(userLikeRef);
      setUserLiked(false);
    } else {
      // If the user has not liked yet, add their like
      update(likesRef, { likes: likes + 1 });
      update(userLikeRef, { liked: true });
      setUserLiked(true);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between mt-8 space-x-6">
      <button
        onClick={handleLikeToggle}
        className={`flex items-center space-x-3 px-8 py-4 text-white font-semibold text-lg rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ${
          userLiked ? 'bg-gradient-to-r from-red-500 to-red-700' : 'bg-gradient-to-r from-blue-500 to-blue-700'
        }`}
      >
        <span>{userLiked ? 'Ya no me gusta' : 'Me gusta'}</span>
        <span className="text-2xl">{userLiked ? '👎' : '👍'}</span>
      </button>
      <div
        className="flex items-center justify-center w-20 h-20 bg-orange-500 text-white font-bold text-2xl rounded-full shadow-md transform hover:scale-110 transition-transform duration-300"
      >
        {likes}⭐
      </div>
    </div>
  );
}
