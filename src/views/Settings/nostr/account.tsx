import { useNDK } from "@nostr-dev-kit/ndk-react";
import { accountStore } from "../../../stores/account";
import { Views, viewStore } from "../../../stores/view";
import {
  clearLocalStorage,
  clearSessionStorage,
  clearSyncStorage,
} from "../../../utils/chrome/storage";
import SettingItem from "../SettingItem";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function SettingsNostrAccount() {
  const { getProfile } = useNDK();
  const setView = viewStore((state) => state.setView);
  const user = accountStore((state) => state.user);
  const setAppNotification = viewStore((state) => state.setAppNotification);
  const queryClient = useQueryClient();
  const [fullProfileInfo, setFullProfileInfo] = useState<boolean>(false);

  return (
    <SettingItem
      label={chrome.i18n.getMessage("settings_connected_account")}
      value={
        <>
          <div
            className={`overflow-x-hidden  ${
              fullProfileInfo ? "break-all" : "text-ellipsis"
            }`}
            onClick={() => setFullProfileInfo(!fullProfileInfo)}
          >
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
          </div>
        </>
      }
      buttonLabel={chrome.i18n.getMessage("button_disconnect")}
      buttonOnClick={() => {
        // clear memory
        clearLocalStorage();
        clearSessionStorage();
        clearSyncStorage();
        queryClient.clear();

        setView(Views.LOGIN);
        setAppNotification({
          title: chrome.i18n.getMessage("notification_account_disconnected"),
          type: "success",
        });
      }}
    />
  );
}
