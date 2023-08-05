import "./App.css";
import { NDKProvider } from "@nostr-dev-kit/ndk-react";
import Views from "./views";

function App() {
  return (
    <NDKProvider
      relayUrls={[
        "wss://relay.damus.io",
        "wss://relay.snort.social",
        "wss://purplepag.es",
      ]}
    >
      <Views />
    </NDKProvider>
  );
}

export default App;
