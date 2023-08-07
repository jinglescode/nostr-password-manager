import "./App.css";
import { NDKProvider } from "@nostr-dev-kit/ndk-react";
import Views from "./views";

import {
  PersistQueryClientProvider,
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { QueryClient } from "@tanstack/react-query";

export function createPersister(key = "nostr-password-manager") {
  return {
    persistClient: async (client: PersistedClient) => {
      chrome.storage.local.set({ [key]: client }, () => {});
    },
    restoreClient: async () => {
      return new Promise(function (resolve, reject) {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key]);
        });
      });
    },
    removeClient: async () => {
      await chrome.storage.local.clear();
    },
  } as Persister;
}

const persister = createPersister();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  },
});

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: persister,
      }}
    >
      <NDKProvider
        relayUrls={["wss://relay.damus.io", "wss://relay.snort.social"]}
      >
        <Views />
      </NDKProvider>
    </PersistQueryClientProvider>
  );
}

export default App;
