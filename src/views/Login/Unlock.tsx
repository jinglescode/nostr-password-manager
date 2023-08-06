import { useNDK } from "@nostr-dev-kit/ndk-react";
import {
  clearLocalStorage,
  clearSessionStorage,
  getLocalStorage,
  setSessionStorage,
} from "../../utils/chrome/storage";
import StringCrypto from "string-crypto";
import { useEffect, useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { LoginViews } from "../../enums/views";
import { StorageKeys } from "../../enums/storage";
import { accountStore } from "../../stores/account";
import { AccountStates } from "../../enums/account";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function Unlock({ setStep }: { setStep: Function }) {
  const { ndk, loginWithSecret } = useNDK();
  const [npub, setNpub] = useState<undefined | string>(undefined);
  const [inputPasscode, setInputPasscode] = useState<string>("");
  const [passcodeIsError, setPasscodeIsError] = useState<boolean>(false);
  const setState = accountStore((state) => state.setState);

  const { getProfile } = useNDK();

  useEffect(() => {
    if (ndk) {
      getLocalStorage(StorageKeys.USER_NPUB, (npub) => {
        console.log(22, npub);
        setNpub(npub);
      });
    }
  }, [ndk]);

  async function decrypt() {
    const { decryptString } = new StringCrypto();

    getLocalStorage(StorageKeys.USER_ENCRYPTED_SK, (encryptedsk) => {
      console.log(33, encryptedsk);
      const sk = decryptString(encryptedsk, inputPasscode);
      tryLogIn(sk);
    });
  }

  async function tryLogIn(sk: string) {
    try {
      setPasscodeIsError(false);
      const session = await loginWithSecret(sk);
      setSessionStorage(StorageKeys.USER_SK, sk);
      setStep(LoginViews.CONNECTED);
      setTimeout(() => {
        setState(AccountStates.LOGGED_IN);
      }, 1000);
    } catch (e) {
      setPasscodeIsError(true);
    }
  }

  function forgetAccount() {
    clearLocalStorage();
    clearSessionStorage();
    setStep(LoginViews.SK);
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.keyCode === 13) {
      decrypt();
      //@ts-ignore
      e.target.blur();
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
          Enter a passcode to unlock.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="passcode"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Passcode to decrypt your key
            </label>
            <div className="relative mt-2.5">
              <Input
                type="password"
                name="passcode"
                placeholder="at least 6 characters"
                value={inputPasscode}
                onChange={(e) => setInputPasscode(e.target.value)}
                isError={passcodeIsError}
                onKeyUp={(e) => handleKeyUp(e)}
              />
              {passcodeIsError && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-500"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
            {passcodeIsError && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                Passcode incorrect.
              </p>
            )}
          </div>
        </div>
        <div className="mt-10">
          <Button disabled={inputPasscode.length < 6} onClick={() => decrypt()}>
            Access
          </Button>
          <p className="mt-4 text-sm leading-6 text-gray-500">
            <a onClick={() => forgetAccount()} className="cursor-pointer">
              Connect another account
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
