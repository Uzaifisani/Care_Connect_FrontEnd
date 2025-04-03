import {create} from 'zustand';
import {persist,devtools} from 'zustand/middleware';

const useUserStore = create(
  persist(
    devtools(
      (set, get) => ({
        user: null,

        // Reducer to store user
        setUser: (userData) => {
          set({ user: userData });
        },

        // Reducer to get user
        getUser: () => {
          return get().user;
        },

        // Reducer to delete user
        deleteUser: () => {
          set({ user: null });
        },
      })
    ),
    {
      name: 'user-storage', 
    }
  )
);

export default useUserStore;