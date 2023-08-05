import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Views, viewStore } from "../stores/view";
import LoginView from "./Login";
import MenuView from "./Menu";
import VaultView from "./Vault";
import { getStorage } from "../utils/chrome/storage";
import { AccountStates, accountStore } from "../stores/account";

export default function MainView() {
  const showMenu = viewStore((state) => state.showMenu);
  const view = viewStore((state) => state.view);
  const state = accountStore((state) => state.state);
  const setState = accountStore((state) => state.setState);

  console.log("account state", state);

  useEffect(() => {
    getStorage("user_encryptedsk", (encryptedsk) => {
      if (encryptedsk && state === AccountStates.NOT_LOGGED_IN) {
        setState(AccountStates.LOGGED_IN_NO_ACCESS);
      }
    });
  }, []);

  return (
    <>
      <Navbar />
      {showMenu ? (
        <MenuView />
      ) : (
        <>
          {/* {view === Views.VAULT && <VaultView />}
          {view === Views.LOGIN && <LoginView />} */}

          {(state === AccountStates.NOT_LOGGED_IN ||
            state === AccountStates.LOGGED_IN_NO_ACCESS) && <LoginView />}
        </>
      )}
    </>
  );
}
