import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUserVaultsPost() {
  const queryClient = useQueryClient();
  const { signPublishEvent } = useNDK();

  return useMutation(
    async (event: NDKEvent) => {
      const success = await signPublishEvent(event);
      console.log(9999, "useUserVaultsPost", event);
      if (success) return event;
      return undefined;
    },
    {
      onSettled: (event) => {
        if (event) {
          queryClient.invalidateQueries(["vaults"]);
        }
      },
    }
  );
}
