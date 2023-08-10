import { useNDK } from "@nostr-dev-kit/ndk-react";
import {
  clearLocalStorage,
  clearSessionStorage,
  clearSyncStorage,
  getSyncStorage,
  setSessionStorage,
} from "../../utils/chrome/storage";
import StringCrypto from "string-crypto";
import { useEffect, useState } from "react";
import { LoginViews } from "../../enums/views";
import { StorageKeys } from "../../enums/storage";
import { accountStore } from "../../stores/account";
import { AccountStates } from "../../enums/account";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { Views, viewStore } from "../../stores/view";
import { User } from "../../types/user";
import { getPublicKeys } from "../../utils/nostr/getPublicKeys";
import { useQueryClient } from "@tanstack/react-query";

export default function Unlock({ setStep }: { setStep: Function }) {
  const { ndk, loginWithSecret } = useNDK();
  const [npub, setNpub] = useState<undefined | string>(undefined);
  const [inputPasscode, setInputPasscode] = useState<string>("");
  const [passcodeIsError, setPasscodeIsError] = useState<boolean>(false);
  const setState = accountStore((state) => state.setState);
  const setView = viewStore((state) => state.setView);
  const setUser = accountStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const { getProfile } = useNDK();

  useEffect(() => {
    async function getNpub() {
      if (ndk) {
        const pk = await getSyncStorage(StorageKeys.LOCAL_USER_PK);
        const npub = getPublicKeys(pk).npub;
        setNpub(npub);
      }
    }
    getNpub();
  }, [ndk]);

  async function decrypt() {
    const { decryptString } = new StringCrypto();

    const encryptedsk = await getSyncStorage(
      StorageKeys.LOCAL_USER_ENCRYPTED_SK
    );
    const sk = decryptString(encryptedsk, inputPasscode);
    tryLogIn(sk);
  }

  async function tryLogIn(sk: string) {
    try {
      setPasscodeIsError(false);
      await loginWithSecret(sk);

      const pk = await getSyncStorage(StorageKeys.LOCAL_USER_PK);
      const npub = getPublicKeys(pk).npub;

      let user: User = {
        pk: pk,
        npub: npub,
      };
      setUser(user);

      setSessionStorage(StorageKeys.SESSION_USER_SK, sk);
      setSessionStorage(StorageKeys.SESSION_USER_PASSCODE, inputPasscode);

      setStep(LoginViews.CONNECTED);
      setTimeout(() => {
        setState(AccountStates.LOGGED_IN);
        setView(Views.VAULT);
      }, 1000);
    } catch (e) {
      setPasscodeIsError(true);
    }
    setInputPasscode("");
  }

  function forgetAccount() {
    // clear memory
    clearLocalStorage();
    clearSessionStorage();
    clearSyncStorage();
    queryClient.clear();
    setStep(LoginViews.SK);
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (passcodeIsError) {
      setPasscodeIsError(false);
    }
    if (e.key === "Enter" || e.keyCode === 13) {
      decrypt();
    }
  }

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
          Enter your passcode to unlock.
        </p>
      </div>
      <div className="mx-auto max-w-xl mt-20">
        <Input
          label="Passcode to decrypt your key"
          type="password"
          name="passcode"
          placeholder="at least 6 characters"
          value={inputPasscode}
          onChange={(e) => setInputPasscode(e.target.value)}
          isError={passcodeIsError}
          isErrorMessage="Passcode incorrect."
          onKeyUp={(e) => handleKeyUp(e)}
          after={
            <div
              className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 cursor-pointer"
              onClick={() => decrypt()}
            >
              <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
                enter
              </kbd>
            </div>
          }
        />
        <div className="mt-10">
          <Button disabled={inputPasscode.length < 6} onClick={() => decrypt()}>
            Access
          </Button>
          <p className="mt-4 text-sm leading-6 text-brand-2">
            <a onClick={() => forgetAccount()} className="cursor-pointer">
              Connect another account<span> &rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
