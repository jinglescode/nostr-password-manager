import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Views, viewStore } from "../stores/view";
import LoginView from "./Login";
import MenuView from "./Menu";
import {
  getSessionStorage,
  getSyncStorage,
} from "../utils/chrome/storage";
import { accountStore } from "../stores/account";
import { AccountStates } from "../enums/account";
import { StorageKeys } from "../enums/storage";
import VaultView from "./Vault";
import ItemView from "./Item";
import RoadmapView from "./Roadmap";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { User } from "../types/user";
import { getPublicKeys } from "../utils/nostr/getPublicKeys";
import Notification from "../components/Notification";
import FAQView from "./FAQ";
import DonateView from "./Donate";
import SettingsView from "./Settings";

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
      const encryptedsk = await getSyncStorage(
        StorageKeys.LOCAL_USER_ENCRYPTED_SK
      );

      if (encryptedsk && state === AccountStates.NOT_LOGGED_IN) {
        const sk = await getSessionStorage(StorageKeys.SESSION_USER_SK);

        if (sk) {
          const _user = await loginWithSecret(sk);
          if (_user) {
            const pk = await getSyncStorage(StorageKeys.LOCAL_USER_PK);
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
            {view === Views.LOGIN && <LoginView />}
            {view === Views.VAULT && <VaultView />}
            {view === Views.ITEM && <ItemView />}
            {view === Views.ROADMAP && <RoadmapView />}
            {view === Views.FAQ && <FAQView />}
            {view === Views.DONATE && <DonateView />}
            {view === Views.SETTINGS && <SettingsView />}
          </>
        )}
      </div>
      <Notification />
    </div>
  );
}
