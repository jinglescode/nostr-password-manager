import { create } from "zustand";
import { AccountStates } from "../enums/account";

interface SessionState {
  
}

export const vaultStore = create<SessionState>()((set, get) => ({
  state: AccountStates.NOT_LOGGED_IN,
  setState: (state: AccountStates) => set({ state }),
}));
