import { useNDK } from "@nostr-dev-kit/ndk-react";
import {
  clearLocalStorage,
  clearSessionStorage,
  getLocalStorage,
  setLocalStorage,
  setSessionStorage,
} from "../../utils/chrome/storage";
import StringCrypto from "string-crypto";
import { useEffect, useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { LoginViews } from "../../enums/loginViews";
import { StorageKeys } from "../../enums/storageKeys";
import { accountStore } from "../../stores/account";
import { AccountStates } from "../../enums/accountStates";

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
      const session = await loginWithSecret(sk);
      console.log(44, session);
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
              <input
                type="password"
                name="passcode"
                className={`block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${
                  passcodeIsError
                    ? "ring-red-300 focus:ring-red-500"
                    : "ring-gray-300 focus:ring-indigo-600"
                }`}
                placeholder="at least 6 characters"
                value={inputPasscode}
                onChange={(e) => setInputPasscode(e.target.value)}
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
          <button
            disabled={inputPasscode.length < 6}
            onClick={() => decrypt()}
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Access
          </button>
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
