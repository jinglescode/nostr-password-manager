import { create } from "zustand";

export enum Views {
  VAULT,
  LOGIN,
}

interface SessionState {
  view: Views;
  setView: (view: Views) => void;
  showMenu: boolean;
  toggleShowMenu: () => void;
}

export const viewStore = create<SessionState>()((set, get) => ({
  view: Views.VAULT,
  setView: (view: Views) => set({ view }),
  showMenu: false,
  toggleShowMenu: () => set({ showMenu: !get().showMenu }),
}));
