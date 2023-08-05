import { create } from "zustand";

export enum AccountStates {
  NOT_LOGGED_IN,
  LOGGED_IN_NO_ACCESS,
  LOGGED_IN,
}

interface SessionState {
  state: AccountStates;
  setState: (state: AccountStates) => void;
  npub: string | undefined;
  setNpub: (npub: string) => void;
  sk: string | undefined;
  setSk: (sk: string) => void;
}

export const accountStore = create<SessionState>()((set, get) => ({
  state: AccountStates.NOT_LOGGED_IN,
  setState: (state: AccountStates) => set({ state }),
  npub: undefined,
  setNpub: (npub: string) => set({ npub }),
  sk: undefined,
  setSk: (sk: string) => set({ sk }),
}));
