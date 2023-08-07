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
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { User } from "../types/user";
import { getPublicKeys } from "../utils/nostr/getPublicKeys";

export default function MainView() {
  const { loginWithSecret } = useNDK();
  const view = viewStore((state) => state.view);
  const setView = viewStore((state) => state.setView);
  const showMenu = viewStore((state) => state.showMenu);
  const state = accountStore((state) => state.state);
  const setState = accountStore((state) => state.setState);
  const setUser = accountStore((state) => state.setUser);

  useEffect(() => {
    async function load() {
      const encryptedsk = await getLocalStorage(StorageKeys.USER_ENCRYPTED_SK);
      console.log(111, { encryptedsk });
      if (encryptedsk && state === AccountStates.NOT_LOGGED_IN) {
        const sk = await getSessionStorage(StorageKeys.USER_SK);
        console.log(222, { sk });
        if (sk) {
          const _user = await loginWithSecret(sk);
          if (_user) {
            const pk = await getLocalStorage(StorageKeys.USER_PK);
            const npub = getPublicKeys(pk).npub;

            let user: User = {
              pk: pk,
              npub: npub,
            };
            setUser(user);

            setState(AccountStates.LOGGED_IN);
            setView(Views.VAULT);
          }
        } else {
          setState(AccountStates.LOGGED_IN_NO_ACCESS);
          setView(Views.LOGIN);
        }
      } else {
        setView(Views.LOGIN);
      }
    }
    load();
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
