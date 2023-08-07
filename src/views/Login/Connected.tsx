import { useNDK } from "@nostr-dev-kit/ndk-react";
import { getLocalStorage } from "../../utils/chrome/storage";
import { useEffect, useState } from "react";
import { StorageKeys } from "../../enums/storage";
import { getPublicKeys } from "../../utils/nostr/getPublicKeys";

export default function Connected() {
  const { ndk } = useNDK();
  const [npub, setNpub] = useState<undefined | string>(undefined);

  const { getProfile } = useNDK();

  useEffect(() => {
    async function getNpub() {
      if (ndk) {
        const pk = await getLocalStorage(StorageKeys.LOCAL_USER_PK);
        const npub = getPublicKeys(pk).npub;
        setNpub(npub);
      }
    }
    getNpub();
  }, [ndk]);

  if (npub === undefined) return <></>;

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <img
          className="h-16 mx-auto"
          src={
            getProfile(npub).image
              ? getProfile(npub).image
              : chrome.runtime.getURL("/images/rounded-512.png")
          }
        />
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Welcome{" "}
          {getProfile(npub).displayName
            ? getProfile(npub).displayName
            : getProfile(npub).name
            ? getProfile(npub).name
            : ""}
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          You are connected.
        </p>
      </div>
    </>
  );
}
