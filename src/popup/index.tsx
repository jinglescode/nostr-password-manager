import "./style.css"

import { NDKProvider } from "@nostr-dev-kit/ndk-react"
import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import type {
  PersistedClient,
  Persister
} from "@tanstack/react-query-persist-client"

import MainView from "~views"

import { useSettingsStore } from "../stores/settings"

export function createPersister(key = "nostr-password-manager") {
  return {
    persistClient: async (client: PersistedClient) => {
      chrome.storage.local.set({ [key]: client }, () => {})
    },
    restoreClient: async () => {
      return new Promise(function (resolve, reject) {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key])
        })
      })
    },
    removeClient: async () => {
      await chrome.storage.local.clear()
    }
  } as Persister
}

const persister = createPersister()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  }
})

function IndexPopup() {
  const relays = useSettingsStore((state) => state.relays)

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: persister
      }}>
      <NDKProvider relayUrls={relays}>
        <div className="extension">
          <MainView />
        </div>
      </NDKProvider>
    </PersistQueryClientProvider>
  )
}

export default IndexPopup
