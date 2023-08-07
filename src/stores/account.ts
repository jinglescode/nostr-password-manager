import { create } from "zustand";
import { AccountStates } from "../enums/account";
import { User } from "../types/user";

interface SessionState {
  state: AccountStates;
  setState: (state: AccountStates) => void;
  user: User | undefined;
  setUser: (user: User) => void;
}

export const accountStore = create<SessionState>()((set, get) => ({
  state: AccountStates.NOT_LOGGED_IN,
  setState: (state: AccountStates) => set({ state }),
  user: undefined,
  setUser: (user: User | undefined) => set({ user }),
}));
