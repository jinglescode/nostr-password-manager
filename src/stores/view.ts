import { create } from "zustand";
import { Item } from "../types/item";
import { AppNotification } from "../types/views";

export enum Views {
  INIT,
  VAULT,
  LOGIN,
  ITEM,
  ROADMAP,
  FAQ,
  SUPPORT,
  SETTINGS,
}

interface SessionState {
  view: Views;
  setView: (view: Views) => void;
  showMenu: boolean;
  toggleShowMenu: () => void;
  itemDetails: Item | undefined;
  setItemDetails: (item: Item | undefined) => void;
  appNotification: AppNotification | undefined;
  setAppNotification: (notification: AppNotification | undefined) => void;
}

export const viewStore = create<SessionState>()((set, get) => ({
  view: Views.INIT,
  setView: (view: Views) => set({ view }),
  showMenu: false,
  toggleShowMenu: () => set({ showMenu: !get().showMenu }),
  itemDetails: undefined,
  setItemDetails: (item: Item | undefined) => set({ itemDetails: item }),
  appNotification: undefined,
  setAppNotification: (notification: AppNotification | undefined) =>
    set({ appNotification: notification }),
}));
