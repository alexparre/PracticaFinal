import { create } from 'zustand';
import { db } from '../utils/firebaseConfig';
import { ref, get, update } from 'firebase/database';

const useUserStore = create((set) => ({
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null,

  /** 🔹 Establecer Usuario (Iniciar sesión) */
  setUser: (userData) => {
    set({ user: userData });
    localStorage.setItem('user', JSON.stringify(userData));
  },

  /** 🔹 Cerrar Sesión */
  clearUser: () => {
    set({ user: null });
    localStorage.removeItem('user');
  },

  /** 🔹 Actualizar los Cursos Comprados */
  updatePurchasedCourses: async (newCourses) => {
    set((state) => {
      if (!state.user) return state;

      const updatedPurchasedCourses = [...(state.user.purchasedCourses || []), ...newCourses];

      // Guardar en Firebase
      const userRef = ref(db, `users/user${state.user.id}`);
      update(userRef, { purchasedCourses: updatedPurchasedCourses });

      // Nuevo estado actualizado
      const updatedUser = { ...state.user, purchasedCourses: updatedPurchasedCourses };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { user: updatedUser };
    });
  },

   /** 🔹 Actualizar los datos del usuario en Zustand */
   updateUser: (updatedUser) => {  
    set({ user: updatedUser });
    localStorage.setItem('user', JSON.stringify(updatedUser));
  },
  /** 🔹 Cargar el Usuario desde Firebase */
  fetchUserFromFirebase: async (userId) => {
    try {
      const userRef = ref(db, `users/user${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        set({ user: userData });
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error al obtener usuario desde Firebase:', error);
    }
  },
}));

export default useUserStore;
