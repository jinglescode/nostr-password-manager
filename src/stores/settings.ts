import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { RELAYS } from "../constants/nostr";

interface PersistState {
  relays: string[];
  setRelays: (relays: string[]) => void;
}

export const useSettingsStore = create<PersistState>()(
  persist(
    (set, get) => ({
      relays: RELAYS,
      setRelays: (relays) => set({ relays }),
    }),
    {
      name: "vault-settings",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
