import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Views, viewStore } from "../stores/view";
import LoginView from "./Login";
import MenuView from "./Menu";
import VaultView from "./Vault";
import { getLocalStorage, getSessionStorage } from "../utils/chrome/storage";
import { accountStore } from "../stores/account";
import { AccountStates } from "../enums/accountStates";
import { StorageKeys } from "../enums/storageKeys";

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
      console.log("encryptedsk", encryptedsk);
      if (encryptedsk && state === AccountStates.NOT_LOGGED_IN) {
        getSessionStorage(StorageKeys.USER_SK, (sk) => {
          console.log("sk", sk);
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
    <>
      <Navbar />
      {showMenu ? (
        <MenuView />
      ) : (
        <>{state === AccountStates.LOGGED_IN ? <SignedIn /> : <LoginView />}</>
      )}
    </>
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
