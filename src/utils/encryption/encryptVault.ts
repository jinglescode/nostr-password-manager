import {
  NDKNip07Signer,
  NDKNip46Signer,
  NDKPrivateKeySigner,
} from "@nostr-dev-kit/ndk";
import { Vault } from "../../types/vault";
import StringCrypto from "string-crypto";

export async function encryptVault({
  vault,
  signer,
  passcode,
}: {
  vault: Vault;
  signer: NDKPrivateKeySigner | NDKNip46Signer | NDKNip07Signer;
  passcode: string;
}): Promise<string> {
  const ndkUser = await signer.user();

  const itemsString = JSON.stringify(vault.items);

  const { encryptString } = new StringCrypto();
  const encryptedData1 = encryptString(itemsString, passcode);

  const encryptedData2 = await signer?.encrypt(ndkUser!, encryptedData1);

  return encryptedData2;
}
