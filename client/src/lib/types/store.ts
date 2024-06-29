import { AuthEntityAttribute } from "@/entities/auth-entity";
import { BlogEntityAttribute } from ".";

type Store = AuthEntityAttribute & BlogEntityAttribute;

export type { Store };
