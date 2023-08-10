import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useState } from "react";
import { setSessionStorage, setSyncStorage } from "../../utils/chrome/storage";
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
  const [firstNewPassInput, setFirstNewPassInput] = useState<
    string | undefined
  >(undefined);
  const [inputPasscode, setInputPasscode] = useState("");
  const setState = accountStore((state) => state.setState);
  const setView = viewStore((state) => state.setView);
  const setUser = accountStore((state) => state.setUser);
  const setAppNotification = viewStore((state) => state.setAppNotification);

  async function encrypt() {
    if (session === undefined) return;

    const { encryptString } = new StringCrypto();

    let encryptedString = encryptString(session?.sk, inputPasscode);

    setSyncStorage(StorageKeys.LOCAL_USER_ENCRYPTED_SK, encryptedString);
    const pk = getPublicKeys(session.npub).pk;
    setSyncStorage(StorageKeys.LOCAL_USER_PK, getPublicKeys(session.npub).pk);

    let user: User = {
      pk: pk,
      npub: session.npub,
    };
    setUser(user);

    setSessionStorage(StorageKeys.SESSION_USER_SK, session?.sk);
    setSessionStorage(StorageKeys.SESSION_USER_PASSCODE, inputPasscode);

    setStep(LoginViews.CONNECTED);
    setTimeout(() => {
      setState(AccountStates.LOGGED_IN);
      setView(Views.VAULT);
    }, 1000);
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.keyCode === 13) {
      if (inputPasscode.length < 6) {
        setAppNotification({
          title: "Passcode too short",
          message: "Passcode must be at least 6 characters.",
          type: "error",
        });
        return;
      }

      if (firstNewPassInput == undefined) {
        setFirstNewPassInput(inputPasscode);
      } else if (firstNewPassInput == inputPasscode) {
        encrypt();
      } else if (firstNewPassInput != inputPasscode) {
        setAppNotification({
          title: "Passcode not match",
          message: "Please try again.",
          type: "error",
        });
      }

      setInputPasscode("");
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
          label={
            firstNewPassInput === undefined
              ? "Passcode to encrypt your key"
              : "Repeat your passcode"
          }
          type="password"
          name="passcode"
          placeholder="at least 6 characters"
          value={inputPasscode}
          onChange={(e) => setInputPasscode(e.target.value)}
          onKeyUp={(e) => handleKeyUp(e)}
        />
        {firstNewPassInput !== undefined && (
          <p className="mt-4 text-sm leading-6 text-brand-2">
            <a
              onClick={() => {
                setFirstNewPassInput(undefined);
                setInputPasscode("");
              }}
              className="cursor-pointer"
            >
              Re-enter passcode
            </a>
          </p>
        )}
        <div className="mt-10">
          <Button disabled={inputPasscode.length < 6} onClick={() => encrypt()}>
            Access
          </Button>
        </div>
      </div>
    </>
  );
}
