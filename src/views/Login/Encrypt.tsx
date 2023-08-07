import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useState } from "react";
import { setLocalStorage, setSessionStorage } from "../../utils/chrome/storage";
import StringCrypto from "string-crypto";
import { LoginViews } from "../../enums/views";
import { StorageKeys } from "../../enums/storage";
import { AccountStates } from "../../enums/account";
import { accountStore } from "../../stores/account";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Views, viewStore } from "../../stores/view";
import { getPublicKeys } from "../../utils/nostr/getPublicKeys";
import { User } from "../../types/user";

export default function Encrypt({
  session,
  setStep,
}: {
  session: { sk: string; npub: string } | undefined;
  setStep: Function;
}) {
  const { getProfile } = useNDK();
  const [inputPasscode, setInputPasscode] = useState("");
  const setState = accountStore((state) => state.setState);
  const setView = viewStore((state) => state.setView);
  const setUser = accountStore((state) => state.setUser);

  async function encrypt() {
    if (session === undefined) return;

    const { encryptString } = new StringCrypto();

    let encryptedString = encryptString(session?.sk, inputPasscode);

    setLocalStorage(StorageKeys.USER_ENCRYPTED_SK, encryptedString);
    const pk = getPublicKeys(session.npub).pk;
    setLocalStorage(StorageKeys.USER_PK, getPublicKeys(session.npub).pk);

    let user: User = {
      pk: pk,
      npub: session.npub,
    };
    setUser(user);

    setSessionStorage(StorageKeys.USER_SK, session?.sk);
    setStep(LoginViews.CONNECTED);
    setTimeout(() => {
      setState(AccountStates.LOGGED_IN);
      setView(Views.VAULT);
    }, 1000);
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.keyCode === 13) {
      encrypt();
      //@ts-ignore
      e.target.blur();
    }
  }

  if (session === undefined) return <></>;

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <img
          className="h-16 mx-auto"
          src={
            getProfile(session.npub).image
              ? getProfile(session.npub).image
              : chrome.runtime.getURL("/images/rounded-512.png")
          }
        />
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Welcome{" "}
          {getProfile(session.npub).displayName
            ? getProfile(session.npub).displayName
            : getProfile(session.npub).name
            ? getProfile(session.npub).name
            : ""}
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Enter a passcode to encrypt your key.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-xl sm:mt-20">
        <Input
          label="Passcode to encrypt your key"
          type="password"
          name="passcode"
          placeholder="at least 6 characters"
          value={inputPasscode}
          onChange={(e) => setInputPasscode(e.target.value)}
          onKeyUp={(e) => handleKeyUp(e)}
        />
        <div className="mt-10">
          <Button disabled={inputPasscode.length < 6} onClick={() => encrypt()}>
            Access
          </Button>
        </div>
      </div>
    </>
  );
}
