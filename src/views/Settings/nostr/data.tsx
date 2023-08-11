import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { useUserVaults } from "../../../hooks/useUserVaults";
import SettingItem from "../SettingItem";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function SettingsNostrData() {
  const { data, refetch, isFetching } = useUserVaults();
  const queryClient = useQueryClient();
  const [lastSyncAt, setLastSyncAt] = useState<number | undefined>(undefined);

  useEffect(() => {
    const dataUpdatedAt = queryClient.getQueryState(["vaults"])?.dataUpdatedAt;
    setLastSyncAt(dataUpdatedAt);
  }, [data]);

  return (
    <SettingItem
      label={chrome.i18n.getMessage("settings_user_nostr_data")}
      value={
        <>
          {data?.map((vault, i) => {
            return (
              <div key={vault.id}>
                <p title={chrome.i18n.getMessage("settings_vault_name_tip")}>
                  <span className="text-brand-black leading-4">
                    {chrome.i18n.getMessage("settings_vault_name")}:{" "}
                  </span>
                  <span className="text-brand-gray-light">{vault.id}</span>
                </p>
                <p title={chrome.i18n.getMessage("settings_vault_size_tip")}>
                  <span className="text-brand-black leading-4">
                    {chrome.i18n.getMessage("settings_vault_size")}:{" "}
                  </span>
                  <span className="text-brand-gray-light">
                    {vault.encryptedItems.length}
                  </span>
                </p>
                <p title={chrome.i18n.getMessage("settings_vault_updated_tip")}>
                  <span className="text-brand-black leading-4">
                    {chrome.i18n.getMessage("settings_vault_updated")}:{" "}
                  </span>
                  <span className="text-brand-gray-light">
                    <time dateTime={(vault.mod * 1000).toString()}>
                      {new Date(vault.mod * 1000).toDateString()}
                    </time>
                    ,{" "}
                    <time dateTime={(vault.mod * 1000).toString()}>
                      {new Date(vault.mod * 1000).toLocaleTimeString()}
                    </time>
                  </span>
                </p>
                {lastSyncAt && (
                  <p
                    title={chrome.i18n.getMessage("settings_vault_synced_tip")}
                  >
                    <span className="text-brand-black leading-4">
                      {chrome.i18n.getMessage("settings_vault_synced")}:{" "}
                    </span>
                    <span className="text-brand-gray-light">
                      <time dateTime={lastSyncAt.toString()}>
                        {new Date(lastSyncAt).toDateString()}
                      </time>
                      ,{" "}
                      <time dateTime={lastSyncAt.toString()}>
                        {new Date(lastSyncAt).toLocaleTimeString()}
                      </time>
                    </span>
                  </p>
                )}
              </div>
            );
          })}
          {!isFetching &&
            data?.length === 0 &&
            chrome.i18n.getMessage("settings_vault_no_data")}
        </>
      }
      buttonLabel={
        isFetching ? (
          <div className="flex items-center">
            <ArrowPathIcon
              className={`inline-block w-4 h-4 ${isFetching && "animate-spin"}`}
            />
          </div>
        ) : (
          chrome.i18n.getMessage("settings_vault_refetch")
        )
      }
      buttonOnClick={() => !isFetching && refetch()}
    />
  );
}
