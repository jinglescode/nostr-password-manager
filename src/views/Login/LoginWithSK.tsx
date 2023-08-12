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
    if (e.key === "Enter") {
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
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-black sm:text-4xl">
          {chrome.i18n.getMessage("app_name")}
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          {chrome.i18n.getMessage("app_about_short")}
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-xl sm:mt-20">
        <Input
          label={chrome.i18n.getMessage("form_secret_key")}
          type="password"
          name="sk"
          placeholder="nsec..."
          value={inputSk}
          onChange={(e) => setInputSk(e.target.value)}
          isError={isError}
          isErrorMessage={chrome.i18n.getMessage("form_invalid_secret_key")}
          onKeyUp={(e) => handleKeyUp(e)}
          after={
            <div
              className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 cursor-pointer"
              onClick={() => login()}
            >
              <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-brand-gray-light">
                enter
              </kbd>
            </div>
          }
        />
        <div className="mt-10">
          <Button
            disabled={ndk === undefined || inputSk.length === 0}
            onClick={() => login()}
            hasGradientBackground={true}
          >
            {chrome.i18n.getMessage("button_connect")}
          </Button>
          <p className="mt-4">
            <a
              onClick={() => createAccount()}
              className="cursor-pointer text-brand-2 hover:text-primary text-sm leading-6"
            >
              {chrome.i18n.getMessage("button_create_secret_key")}
              <span> &rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
