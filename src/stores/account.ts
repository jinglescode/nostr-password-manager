import { create } from "zustand";
import { AccountStates } from "../enums/accountStates";

interface SessionState {
  state: AccountStates;
  setState: (state: AccountStates) => void;
}

export const accountStore = create<SessionState>()((set, get) => ({
  state: AccountStates.NOT_LOGGED_IN,
  setState: (state: AccountStates) => set({ state }),
}));
