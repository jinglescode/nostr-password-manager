import { NDKFilter } from "@nostr-dev-kit/ndk";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useQuery } from "@tanstack/react-query";
import { accountStore } from "../stores/account";
import { Vault } from "../types/vault";

export function useUserVaults() {
  const { ndk, fetchEvents, signer } = useNDK();
  const user = accountStore((state) => state.user);

  const { status, data, error, isFetching, refetch } = useQuery(
    ["vaults"],
    async () => {
      const ndkUser = await signer?.user();

      if (!ndkUser || !user) return undefined;

      const filter: NDKFilter = {
        //@ts-ignore
        kinds: [34567],
        authors: [user.pk],
      };

      const events = await fetchEvents(filter);
      console.log(9999, "useUserVaults", events.length, events);

      let vaults: Vault[] = [];

      events.forEach(async (event) => {
        const dTags = event.tags.filter((t) => t[0] === "d");
        if (dTags.length !== 1) return;

        const id = dTags[0][1];
        const mod = event.created_at;
        const encrypted_items = event.content;

        const vault: Vault = {
          id: id,
          mod: mod!,
          items: {},
          encryptedItems: encrypted_items,
        };

        vaults.push(vault);
      });

      return vaults;
    },
    {
      enabled: !!ndk && !!user,
    }
  );

  return { status, data, error, isFetching, refetch };
}
