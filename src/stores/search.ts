import { create } from "zustand";
import { AccountStates } from "../enums/accountStates";

interface SessionState {
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
}

export const searchStore = create<SessionState>()((set, get) => ({
  searchInput: "",
  setSearchInput: (searchInput: string) => set({ searchInput }),
}));
