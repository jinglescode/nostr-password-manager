import { useEffect, useState } from "react";
import LoginStep1 from "./LoginStep1";
import LoginStep2 from "./LoginStep2";
import { AccountStates, accountStore } from "../../stores/account";
import Unlock from "./Unlock";

export default function LoginView() {
  const [step, setStep] = useState(1);
  const [inputSk, setInputSk] = useState("");
  const [session, setSession] = useState<
    undefined | { sk: string; npub: string }
  >(undefined);

  const state = accountStore((state) => state.state);

  useEffect(() => {
    if (state === AccountStates.LOGGED_IN_NO_ACCESS) {
      setStep(3);
    }
  }, []);

  console.log("step", step);

  return (
    <div className="isolate bg-white px-6 pt-20">
      {step === 1 && (
        <LoginStep1
          inputSk={inputSk}
          setInputSk={setInputSk}
          setSession={setSession}
          setStep={setStep}
        />
      )}
      {step === 2 && <LoginStep2 session={session} setStep={setStep} />}
      {step === 3 && <Unlock setStep={setStep} />}
    </div>
  );
}
