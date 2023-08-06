import { useEffect, useState } from "react";
import LoginWithSK from "./LoginWithSK";
import Encrypt from "./Encrypt";
import { accountStore } from "../../stores/account";
import Unlock from "./Unlock";
import Connected from "./Connected";
import { LoginViews } from "../../enums/views";
import { AccountStates } from "../../enums/account";

export default function LoginView() {
  const [step, setStep] = useState<LoginViews>(LoginViews.SK);
  const [inputSk, setInputSk] = useState("");
  const [session, setSession] = useState<
    undefined | { sk: string; npub: string }
  >(undefined);

  const state = accountStore((state) => state.state);

  useEffect(() => {
    if (state === AccountStates.LOGGED_IN_NO_ACCESS) {
      setStep(LoginViews.UNLOCK);
    }
  }, [state]);

  console.log("step:", step);

  return (
    <div className="isolate bg-white px-6 pt-20">
      {step === LoginViews.SK && (
        <LoginWithSK
          inputSk={inputSk}
          setInputSk={setInputSk}
          setSession={setSession}
          setStep={setStep}
        />
      )}
      {step === LoginViews.ENCRYPT && (
        <Encrypt session={session} setStep={setStep} />
      )}
      {step === LoginViews.UNLOCK && <Unlock setStep={setStep} />}
      {step === LoginViews.CONNECTED && <Connected />}
    </div>
  );
}
