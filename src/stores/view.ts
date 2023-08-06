import { create } from "zustand";
import { Item } from "../types/item";

export enum Views {
  INIT,
  VAULT,
  LOGIN,
  ITEM,
  ROADMAP,
  FAQ,
}

interface SessionState {
  view: Views;
  setView: (view: Views) => void;
  showMenu: boolean;
  toggleShowMenu: () => void;
  itemDetails: Item | undefined;
  setItemDetails: (item: Item | undefined) => void;
}

export const viewStore = create<SessionState>()((set, get) => ({
  view: Views.INIT,
  setView: (view: Views) => set({ view }),
  showMenu: false,
  toggleShowMenu: () => set({ showMenu: !get().showMenu }),
  itemDetails: undefined,
  setItemDetails: (item: Item | undefined) => set({ itemDetails: item }),
}));
