import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useEffect, useState } from "react";
import Input from "../../components/Input";
import { nip19, generatePrivateKey } from "nostr-tools";
import Button from "../../components/Button";
import { LoginViews } from "../../enums/views";
import { DocumentDuplicateIcon } from "@heroicons/react/20/solid";
import { useClipboard } from "../../hooks/useCopyClipboard";
import { viewStore } from "../../stores/view";

export default function NewAccount({
  setSession,
  setStep,
}: {
  setSession: Function;
  setStep: Function;
}) {
  const [sk, setSk] = useState<undefined | string>(undefined);

  const { ndk, loginWithSecret } = useNDK();
  const setAppNotification = viewStore((state) => state.setAppNotification);
  const { onCopy: copySk } = useClipboard(sk || "");

  useEffect(() => {
    let sk = generatePrivateKey();
    let nsec = nip19.nsecEncode(sk);
    setSk(nsec);
  }, []);

  async function handleNext() {
    if (ndk === undefined || sk === undefined) return;

    const session = await loginWithSecret(sk);
    if (session) {
      setSession(session);
      setStep(LoginViews.ENCRYPT);
    }
  }

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <img
          className="h-16 mx-auto"
          src={chrome.runtime.getURL("/images/rounded-512.png")}
        />
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-black sm:text-4xl">
          New Account
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          This is your secret key, keep it safe!
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-xl sm:mt-20">
        <Input
          label="Your Secret Key"
          type="text"
          name="sk"
          placeholder=""
          value={sk || ""}
          onChange={(e) => {}}
          disabled={true}
          after={
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <button
                onClick={() => {
                  copySk();
                  setAppNotification({
                    title: "Secret key copied to clipboard",
                    type: "success",
                  });
                }}
                className="text-brand-gray-light hover:text-brand-3 active:text-primary"
                title="Copy secret key"
              >
                <DocumentDuplicateIcon className="h-6 w-6" />
              </button>
            </div>
          }
        />
        <div className="mt-10">
          <Button onClick={() => handleNext()}>I've copied this key</Button>
        </div>
      </div>
    </>
  );
}
