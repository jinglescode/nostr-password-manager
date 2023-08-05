import { useNDK } from "@nostr-dev-kit/ndk-react";
import { getStorage, setStorage } from "../../utils/chrome/storage";
import StringCrypto from "string-crypto";
import { useEffect, useState } from "react";

export default function Unlock({ setStep }: { setStep: Function }) {
  const { ndk } = useNDK();
  const [npub, setNpub] = useState<undefined | string>(undefined);
  const [inputPasscode, setInputPasscode] = useState("");

  const { getProfile } = useNDK();

  useEffect(() => {
    if (ndk) {
      getStorage("user_npub", (npub) => {
        console.log(22, npub);
        setNpub(npub);
      });
    }
  }, [ndk]);

  async function decrypt() {
    const { decryptString } = new StringCrypto();

    getStorage("user_encryptedsk", (encryptedsk) => {
      console.log(33, encryptedsk);
    });

    // let encryptedString = encryptString(session?.sk, inputPasscode);
    // console.log(3, encryptedString);
    // setStorage("user_encryptedsk", encryptedString);
    // setStorage("user_npub", session.npub);
    // console.log("Decrypted String 1:", decryptString(encryptedString, code));
    // console.log("Decrypted String 2:", decryptString(encryptedString, "123"));
  }

  function forgetAccount() {
    setStorage("user_encryptedsk", undefined);
    setStorage("user_npub", undefined);
  }

  if (npub === undefined) return <></>;

  console.log(55, getProfile(npub));
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
          {getProfile(npub).displayName
            ? getProfile(npub).displayName
            : getProfile(npub).name
            ? getProfile(npub).name
            : "Welcome"}
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Enter a passcode to access your account.
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
            <div className="mt-2.5">
              <input
                type="password"
                name="passcode"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="at least 6 characters"
                value={inputPasscode}
                onChange={(e) => setInputPasscode(e.target.value)}
              />
            </div>
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
