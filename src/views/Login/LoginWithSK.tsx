import { useNDK } from "@nostr-dev-kit/ndk-react";
import { LoginViews } from "../../enums/views";
import Input from "../../components/Input";
import { useState } from "react";
import Button from "../../components/Button";

export default function LoginWithSK({
  inputSk,
  setInputSk,
  setSession,
  setStep,
}: {
  inputSk: string;
  setInputSk: Function;
  setSession: Function;
  setStep: Function;
}) {
  const { ndk, loginWithSecret } = useNDK();
  const [isError, setIsError] = useState<boolean>(false);

  async function login() {
    try {
      setIsError(false);
      const session = await loginWithSecret(inputSk);
      if (session) {
        setSession(session);
        setStep(LoginViews.ENCRYPT);
      }
    } catch (e) {
      setIsError(true);
    }
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.keyCode === 13) {
      login();
    }
  }

  async function createAccount() {
    setStep(LoginViews.NEWACCOUNT);
  }

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <img
          className="h-16 mx-auto"
          src={chrome.runtime.getURL("/images/rounded-512.png")}
        />
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          NOSTR Password Manager
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Secure your passwords and notes, encrypted by your key and a passcode.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-xl sm:mt-20">
        <Input
          label="NOSTR Secret Key"
          type="password"
          name="sk"
          placeholder="nsec..."
          value={inputSk}
          onChange={(e) => setInputSk(e.target.value)}
          isError={isError}
          isErrorMessage="Invalid secret key"
          onKeyUp={(e) => handleKeyUp(e)}
          after={
            <div
              className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 cursor-pointer"
              onClick={() => login()}
            >
              <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
                enter
              </kbd>
            </div>
          }
        />
        <div className="mt-10">
          <Button
            disabled={ndk === undefined || inputSk.length === 0}
            onClick={() => login()}
          >
            Connect
          </Button>
          <p className="mt-4 text-sm leading-6 text-brand-2">
            <a onClick={() => createAccount()} className="cursor-pointer">
              Create account<span> &rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
