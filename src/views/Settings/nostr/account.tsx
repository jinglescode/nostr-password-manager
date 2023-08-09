import { useNDK } from "@nostr-dev-kit/ndk-react";
import { accountStore } from "../../../stores/account";
import { Views, viewStore } from "../../../stores/view";
import {
  clearLocalStorage,
  clearSessionStorage,
} from "../../../utils/chrome/storage";
import SettingItem from "../SettingItem";
import { useSettingsStore } from "../../../stores/settings";

export default function SettingsNostrAccount() {
  const { getProfile } = useNDK();
  const setView = viewStore((state) => state.setView);
  const user = accountStore((state) => state.user);
  const setAppNotification = viewStore((state) => state.setAppNotification);

  return (
    <SettingItem
      label="Connected account"
      value={
        <>
          {user?.npub && (
            <>
              {getProfile(user.npub).displayName ? (
                <>
                  {getProfile(user.npub).displayName}
                  <br />
                </>
              ) : getProfile(user.npub).name ? (
                <>
                  {getProfile(user.npub).name}
                  <br />
                </>
              ) : (
                <></>
              )}
            </>
          )}
          {user?.npub}
        </>
      }
      buttonLabel="Disconnect"
      buttonOnClick={() => {
        clearLocalStorage();
        clearSessionStorage();
        useSettingsStore.persist.clearStorage();
        setView(Views.LOGIN);
        setAppNotification({
          title: "Account disconnected",
          type: "success",
        });
      }}
    />
  );
}
