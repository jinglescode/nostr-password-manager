import {
  NDKNip07Signer,
  NDKNip46Signer,
  NDKPrivateKeySigner,
} from "@nostr-dev-kit/ndk";
import { Vault } from "../../types/vault";
import StringCrypto from "string-crypto";

export async function decryptVaults({
  signer,
  vaults,
  passcode,
}: {
  signer: NDKPrivateKeySigner | NDKNip46Signer | NDKNip07Signer;
  vaults: Vault[];
  passcode: string;
}): Promise<{
  [vaultId: string]: Vault;
}> {
  return new Promise(async (resolve, reject) => {
    let decryptedVaults: {
      [vaultId: string]: Vault;
    } = {};

    const ndkUser = await signer?.user();

    if (vaults && ndkUser) {
      for (let vault of vaults) {
        const decryptedItems1 = await signer?.decrypt(
          ndkUser,
          vault.encryptedItems
        );

        if (decryptedItems1) {
          const { decryptString } = new StringCrypto();
          const decryptedItems2 = decryptString(decryptedItems1, passcode);

          try {
            const decryptedItems3 = JSON.parse(decryptedItems2);
            vault.items = decryptedItems3;
            decryptedVaults = { ...decryptedVaults, [vault.id]: vault };
          } catch (e) {
            reject({ error: "Invalid passcode." });
          }
        }
      }

      resolve(decryptedVaults);
    } else {
      reject({});
    }
  });
}
