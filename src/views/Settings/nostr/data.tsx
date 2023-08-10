import { useUserVaults } from "../../../hooks/useUserVaults";
import SettingItem from "../SettingItem";

export default function SettingsNostrData() {
  const { data, refetch, isFetching } = useUserVaults();

  return (
    <SettingItem
      label="Data on NOSTR"
      value={
        <>
          {data?.map((vault, i) => {
            return (
              <div key={vault.id}>
                <p>
                  <span className="text-gray-900 leading-4">Vault name: </span>
                  <span className="text-gray-500">{vault.id}</span>
                </p>
                <p>
                  <span className="text-gray-900 leading-4">
                    Last updated:{" "}
                  </span>
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
              </div>
            );
          })}
          {!isFetching && data?.length === 0 && <>No data</>}
        </>
      }
      buttonLabel={isFetching ? "Fetching..." : "Refetch"}
      buttonOnClick={() => !isFetching && refetch()}
    />
  );
}
