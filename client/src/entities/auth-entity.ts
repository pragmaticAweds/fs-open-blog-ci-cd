import { StateCreator } from "zustand";

import { AuthAttribute } from "@/lib/types";

type AuthActionAttributes = {
  setAuth: (authData: AuthAttribute) => void;
};

export type AuthEntityAttribute = AuthAttribute & AuthActionAttributes;

export const createAuthEntity: StateCreator<
  AuthEntityAttribute,
  [["zustand/immer", never]],
  [],
  AuthEntityAttribute
> = (set) => ({
  token: null,
  isLoggedIn: false,
  username: "",
  setAuth: (authData) =>
    set((state) => {
      const { isLoggedIn, token, username } = authData;

      state.isLoggedIn = isLoggedIn;
      state.token = token;
      state.username = username;
    }),
});
