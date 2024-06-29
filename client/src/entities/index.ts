import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { Store } from "@/lib/types/store";
import { createAuthEntity } from "./auth-entity";
import { createBlogEntity } from "./blog-entity";

export const useStore = create<Store>()(
  immer((...a) => ({
    ...createAuthEntity(...a),
    ...createBlogEntity(...a),
  }))
);
