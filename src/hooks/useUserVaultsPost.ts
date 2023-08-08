import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Vault } from "../types/vault";
import StringCrypto from "string-crypto";
import { accountStore } from "../stores/account";

export function useUserVaultsPost() {
  const queryClient = useQueryClient();
  const { ndk, signer, signPublishEvent } = useNDK();
  const user = accountStore((state) => state.user);

  return useMutation(
    async (vault: Vault) => {
      if (!ndk || !user || !signer) return undefined;

      const ndkUser = await signer.user();

      const itemsString = JSON.stringify(vault.items);

      const { encryptString } = new StringCrypto();
      const encryptedData1 = encryptString(itemsString, user.passcode);

      const encryptedData2 = await signer?.encrypt(ndkUser!, encryptedData1);

      const event = new NDKEvent();
      event.kind = 34567;
      event.content = encryptedData2;
      event.tags = [["d", vault.id]];
      console.log(9999, "update vault", event);

      const success = await signPublishEvent(event);
      if (success) return event;
      return undefined;
    },
    {
      onSettled: (event) => {
        if (event) {
          const dTags = event.tags.filter((t) => t[0] === "d");
          if (dTags.length > 0) {
            queryClient.invalidateQueries(["vaults", dTags[0][1]]);
          }
        }
      },
    }
  );
}
