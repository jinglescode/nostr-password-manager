import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Views, viewStore } from "../stores/view";
import LoginView from "./Login";
import MenuView from "./Menu";
import { getLocalStorage, getSessionStorage } from "../utils/chrome/storage";
import { accountStore } from "../stores/account";
import { AccountStates } from "../enums/account";
import { StorageKeys } from "../enums/storage";
import Roadmap from "./Roadmap";
import VaultView from "./Vault";
import ItemView from "./Item";
import RoadmapView from "./Roadmap";

export default function MainView() {
  const view = viewStore((state) => state.view);
  const setView = viewStore((state) => state.setView);
  const showMenu = viewStore((state) => state.showMenu);
  const state = accountStore((state) => state.state);
  const setState = accountStore((state) => state.setState);

  useEffect(() => {
    getLocalStorage(StorageKeys.USER_ENCRYPTED_SK, (encryptedsk) => {
      if (encryptedsk && state === AccountStates.NOT_LOGGED_IN) {
        getSessionStorage(StorageKeys.USER_SK, (sk) => {
          if (sk) {
            setState(AccountStates.LOGGED_IN);
            setView(Views.VAULT);
          } else {
            setState(AccountStates.LOGGED_IN_NO_ACCESS);
            setView(Views.LOGIN);
          }
        });
      } else {
        setView(Views.LOGIN);
      }
    });
  }, []);

  if (view === Views.INIT) return <></>;

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
      {view === Views.ITEM && <ItemView />}
      {view === Views.ROADMAP && <RoadmapView />}
    </>
  );
}
