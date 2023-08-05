import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useEffect } from "react";
import { NDKFilter } from "@nostr-dev-kit/ndk";
import List from "./List";
import { getTabUrl } from "../../utils/chrome/getTabUrl";

export default function VaultView() {
  const {
    ndk,
    signer,
    fetchEvents,
    loginWithNip07,
    loginWithNip46,
    loginWithSecret,
    signPublishEvent,
  } = useNDK();

  useEffect(() => {
    async function init() {
      console.log(555, await getTabUrl());
      const filter: NDKFilter = {
        kinds: [1],
        ids: [
          "24df6c87b6d938116a10983b92a1cc6529a87890f75a3ca53f9c3c4c78468868",
        ],
      };
      const events = await fetchEvents(filter);
      if (events.length === 1) {
        const event = events[0];
        console.log(33, event.id);
      }
    }
    if (ndk) {
      init();
    }
  }, [ndk]);

  return (
    <>
      <List />
    </>
  );
}
