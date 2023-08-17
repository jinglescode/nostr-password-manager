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
import type { User } from "../../types/user";
import { getPublicKeys } from "../../utils/nostr/getPublicKeys";
import { useQueryClient } from "@tanstack/react-query";
import logo from "data-base64:~assets/icon.png"

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
    if (e.key === "Enter") {
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
              : logo
          }
        />
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-black sm:text-4xl">
          Welcome{" "}
          {getProfile(npub).displayName
            ? getProfile(npub).displayName
            : getProfile(npub).name
            ? getProfile(npub).name
            : ""}
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          {chrome.i18n.getMessage("info_enter_passcode_unlock")}
        </p>
      </div>
      <div className="mx-auto max-w-xl mt-20">
        <Input
          label={chrome.i18n.getMessage("form_passcode_decrypt_key")}
          type="password"
          name="passcode"
          placeholder={chrome.i18n.getMessage("form_passcode_6_chars")}
          value={inputPasscode}
          onChange={(e) => setInputPasscode(e.target.value)}
          isError={passcodeIsError}
          isErrorMessage={chrome.i18n.getMessage(
            "form_error_passcode_incorrect"
          )}
          onKeyUp={(e) => handleKeyUp(e)}
          after={
            <div
              className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 cursor-pointer"
              onClick={() => decrypt()}
            >
              <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-brand-gray-light">
                enter
              </kbd>
            </div>
          }
        />
        <div className="mt-10">
          <Button
            disabled={inputPasscode.length < 6}
            onClick={() => decrypt()}
            hasGradientBackground={true}
          >
            {chrome.i18n.getMessage("button_continue")}
          </Button>
          <p className="mt-4">
            <a
              onClick={() => forgetAccount()}
              className="cursor-pointer text-brand-2 hover:text-primary text-sm leading-6"
            >
              {chrome.i18n.getMessage("button_connect_another_account")}
              <span> &rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
