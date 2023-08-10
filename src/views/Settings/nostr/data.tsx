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
      label="Your data on NOSTR network"
      value={
        <>
          {data?.map((vault, i) => {
            return (
              <div key={vault.id}>
                <p title="This is an identifier">
                  <span className="text-gray-900 leading-4">Vault name: </span>
                  <span className="text-gray-500">{vault.id}</span>
                </p>
                <p title="There are different size limit for different relays for how long a 'content' can be">
                  <span className="text-gray-900 leading-4">Data size: </span>
                  <span className="text-gray-500">
                    {vault.encryptedItems.length}
                  </span>
                </p>
                <p title="Data last updated on NOSTR network">
                  <span className="text-gray-900 leading-4">Updated: </span>
                  <span className="text-gray-500">
                    <time dateTime={(vault.mod * 1000).toString()}>
                      {new Date(vault.mod * 1000).toDateString()}
                    </time>{" "}
                    at{" "}
                    <time dateTime={(vault.mod * 1000).toString()}>
                      {new Date(vault.mod * 1000).toLocaleTimeString()}
                    </time>
                  </span>
                </p>
                {lastSyncAt && (
                  <p title="Data last synced to your device">
                    <span className="text-gray-900 leading-4">Synced: </span>
                    <span className="text-gray-500">
                      <time dateTime={lastSyncAt.toString()}>
                        {new Date(lastSyncAt).toDateString()}
                      </time>{" "}
                      at{" "}
                      <time dateTime={lastSyncAt.toString()}>
                        {new Date(lastSyncAt).toLocaleTimeString()}
                      </time>
                    </span>
                  </p>
                )}
              </div>
            );
          })}
          {!isFetching && data?.length === 0 && <>No data</>}
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
          "Refetch"
        )
      }
      buttonOnClick={() => !isFetching && refetch()}
    />
  );
}
