import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";

import { AuthAttribute } from "@/lib/types";

const initialEntity = {
  isLoggedIn: false,
  token: null,
  username: "",
};

const useAuthStore = create<AuthAttribute>()(
  persist(
    (set) => ({
      ...initialEntity,
      setAuth: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),
    }),
    { name: "authStorage", storage: createJSONStorage(() => sessionStorage) }
  )
);

export default useAuthStore;
