import { useUserVaults } from "../../hooks/useUserVaults";
import { useEffect, useState } from "react";
import { Item } from "../../types/item";
import { ItemKeys, ItemType } from "../../enums/item";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { Vault } from "../../types/vault";
import { accountStore } from "../../stores/account";
import { searchStore } from "../../stores/search";
import { getActiveTab } from "../../utils/chrome/getActiveTab";
import LoginItem from "./Item/login";
import { Virtuoso } from "react-virtuoso";
import { decryptVaults } from "../../utils/encryption/decryptVaults";
import { Views, viewStore } from "../../stores/view";
import { getSessionStorage } from "../../utils/chrome/storage";
import { StorageKeys } from "../../enums/storage";
import { ArrowPathIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import NoteItem from "./Item/note";

export default function VaultView() {
  const { data: vaults, refetch, isFetching } = useUserVaults();

  const user = accountStore((state) => state.user);
  const { signer } = useNDK();
  const setView = viewStore((state) => state.setView);
  const setAppNotification = viewStore((state) => state.setAppNotification);

  const [decryptedVaults, setDecryptedVaults] = useState<{
    [vaultId: string]: Vault;
  }>({});

  const searchInput = searchStore((state) => state.searchInput);
  const [currentDomain, setCurrentDomain] = useState<undefined | string>(
    undefined
  );

  useEffect(() => {
    async function load() {
      const tab = await getActiveTab();
      if (tab && tab.url) {
        let __url = new URL(tab.url);
        let _domain = __url.hostname;
        _domain = _domain.replace("www.", "");
        setCurrentDomain(_domain);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function decryptData() {
      if (vaults && signer) {
        const passcode = await getSessionStorage(
          StorageKeys.SESSION_USER_PASSCODE
        );

        await decryptVaults({
          signer,
          vaults,
          passcode: passcode,
        })
          .then((decryptedVaults) => {
            setDecryptedVaults(decryptedVaults);
          })
          .catch((e) => {
            setAppNotification({
              title: "Error decrypting vaults",
              message:
                "The passcode you have enter is incorrect. Check FAQ for details.",
              type: "error",
            });
          });
      }
    }
    decryptData();
  }, [vaults, signer, user]);

  const items = Object.keys(decryptedVaults)
    .map((vaultId) => {
      let list = decryptedVaults[vaultId];
      return Object.keys(list.items).map((itemId) => {
        let item = list.items[itemId];
        item.vaultId = vaultId;
        return item;
      });
    })
    .reduce((acc, val) => acc.concat(val), [])
    .filter(filterItem)
    .sort(sort);

  function sort(a: Item, b: Item) {
    if (!searchInput) {
      if (a.login && b.login) {
        if (currentDomain) {
          if (a.login[ItemKeys.URI].some((v) => v.includes(currentDomain))) {
            return -1;
          }
          if (b.login[ItemKeys.URI].some((v) => v.includes(currentDomain))) {
            return 1;
          }
        } else {
          return 0;
        }
      }
    }
    return 0;
  }

  function filterItem(item: Item) {
    if (!searchInput) {
      return true;
    }

    const _searchInput = searchInput.trim().toLowerCase();

    // check name
    if (item[ItemKeys.NAME].toLowerCase().includes(_searchInput)) return true;

    // check login
    if (item[ItemKeys.TYPE] === ItemType.LOGIN && item.login) {
      if (item.login[ItemKeys.USERNAME].toLowerCase().includes(_searchInput))
        return true;
      if (item.login[ItemKeys.URI].some((v) => v.includes(_searchInput)))
        return true;
    }

    // check note
    if (item[ItemKeys.TYPE] === ItemType.NOTE && item.note) {
      if (item.note[ItemKeys.TEXT].toLowerCase().includes(_searchInput))
        return true;
    }

    return false;
  }

  function rowRenderer({ index, item }: { index: number; item: Item }) {
    return (
      <>
        {item[ItemKeys.TYPE] === ItemType.LOGIN && item.login && (
          <LoginItem key={index} item={item} />
        )}
        {item[ItemKeys.TYPE] === ItemType.NOTE && item.note && (
          <NoteItem key={index} item={item} />
        )}
      </>
    );
  }

  if (items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-md">No items in vault</p>
        <p className="mt-2 text-sm leading-6 text-brand-2">
          <a
            onClick={() => setView(Views.ITEM)}
            className="cursor-pointer flex items-center"
          >
            Add Item
            <ArrowRightIcon className={`inline-block w-4 h-4 ml-1`} />
          </a>
        </p>
        <p className="mt-2 text-sm leading-6 text-brand-2">
          <a
            onClick={() => !isFetching && refetch()}
            className={`cursor-pointer flex items-center`}
          >
            {isFetching ? (
              <>
                Fetching Data
                <ArrowPathIcon
                  className={`inline-block w-4 h-4 ml-1 ${
                    isFetching && "animate-spin"
                  }`}
                />
              </>
            ) : (
              <>Refetch Data</>
            )}
          </a>
        </p>
      </div>
    );

  return (
    <>
      <Virtuoso
        style={{ height: "100%" }}
        data={items}
        itemContent={(index, item) => rowRenderer({ index, item })}
      />
    </>
  );
}
