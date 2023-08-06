import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Views, viewStore } from "../stores/view";
import LoginView from "./Login";
import MenuView from "./Menu";
import VaultView from "./Vault";
import { getLocalStorage, getSessionStorage } from "../utils/chrome/storage";
import { accountStore } from "../stores/account";
import { AccountStates } from "../enums/account";
import { StorageKeys } from "../enums/storage";

export default function MainView() {
  const showMenu = viewStore((state) => state.showMenu);
  const state = accountStore((state) => state.state);
  const setState = accountStore((state) => state.setState);
  const [loaded, setLoaded] = useState<boolean>(false);

  console.log("account state", state);

  getSessionStorage(StorageKeys.USER_SK, (sk) => {
    console.log("sk", sk);
  });

  useEffect(() => {
    getLocalStorage(StorageKeys.USER_ENCRYPTED_SK, (encryptedsk) => {
      console.log(55, "encryptedsk", encryptedsk);
      if (encryptedsk && state === AccountStates.NOT_LOGGED_IN) {
        getSessionStorage(StorageKeys.USER_SK, (sk) => {
          console.log(55, "sk", sk);
          if (sk) {
            setState(AccountStates.LOGGED_IN);
          } else {
            setState(AccountStates.LOGGED_IN_NO_ACCESS);
          }
        });
      }
    });
    setLoaded(true);
  }, []);

  if (!loaded) return <></>;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="overflow-y-auto h-full">
        {showMenu ? (
          <MenuView />
        ) : (
          <>
            {state === AccountStates.LOGGED_IN ? <SignedIn /> : <LoginView />}
          </>
        )}
      </div>
    </div>
  );
}

function SignedIn() {
  const view = viewStore((state) => state.view);
  return (
    <>
      {view === Views.VAULT && <VaultView />}
      {view === Views.LOGIN && <LoginView />}
    </>
  );
}
