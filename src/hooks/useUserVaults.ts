import { NDKFilter } from "@nostr-dev-kit/ndk";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useQuery } from "@tanstack/react-query";

export function useUserVaults(pk: string | undefined) {
  const { ndk, fetchEvents } = useNDK();
  const { status, data, error, isFetching, refetch } = useQuery(
    ["vaults"],
    async () => {
      const filter: NDKFilter = {
        //@ts-ignore
        kinds: [34567],
        authors: [pk!],
      };
      const events = await fetchEvents(filter);
      console.log(9999, "events", filter, events.length, events);

      const vaults = events.map((event) => {
        return {
          id: event.id,
        };
      });

      console.log(9999, "useUserVault", vaults.length);

      return vaults;
    },
    {
      enabled: !!ndk && !!pk,
      // staleTime: 1000 * 60,
    }
  );

  return { status, data, error, isFetching, refetch };
}
