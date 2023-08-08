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

export default function VaultView() {
  const { data: vaults } = useUserVaults();

  const user = accountStore((state) => state.user);
  const { signer } = useNDK();

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
        console.log(11111, tab)
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
      if (vaults && signer && user) {
        const _decryptedVaults = await decryptVaults({ signer, vaults, user });
        //@ts-ignore
        setDecryptedVaults(_decryptedVaults);
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
    if (item[ItemKeys.TYPE] === ItemType.LOGIN && item.login) {
      if (!searchInput) {
        // if (currentDomain) {
        //   if (item.login[ItemKeys.URI].some((v) => v.includes(currentDomain))) {
        //     return true;
        //   }
        // } else {
        //   return true;
        // }
        return true;
      } else {
        const _searchInput = searchInput.trim().toLowerCase();

        if (item[ItemKeys.NAME].toLowerCase().includes(_searchInput)) {
          return true;
        }

        if (
          item.login[ItemKeys.USERNAME].toLowerCase().includes(_searchInput)
        ) {
          return true;
        }

        if (item.login[ItemKeys.URI].some((v) => v.includes(_searchInput))) {
          return true;
        }
      }
    }

    return false;
  }

  function rowRenderer({ index, item }: { index: number; item: Item }) {
    return <LoginItem key={index} item={item} />;
  }

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
