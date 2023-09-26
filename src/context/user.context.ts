import { createContext } from "react";
import { AppUser } from "../model/user.model";

export const UserContext = createContext<AppUser | null | undefined>(null);
