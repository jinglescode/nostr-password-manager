import { useNDK } from "@nostr-dev-kit/ndk-react";
import { LoginViews } from "../../enums/loginViews";

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

  async function login() {
    const session = await loginWithSecret(inputSk);
    if (session) {
      console.log(session);
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
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          NOSTR Password Manager
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Secure your passwords and notes, encrypted by your key and a passcode.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="sk"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              NOSTR Secret Key
            </label>
            <div className="mt-2.5">
              <input
                type="password"
                name="sk"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="nsec..."
                value={inputSk}
                onChange={(e) => setInputSk(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            disabled={ndk === undefined || inputSk.length === 0}
            onClick={() => login()}
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Connect
          </button>
        </div>
      </div>
    </>
  );
}
