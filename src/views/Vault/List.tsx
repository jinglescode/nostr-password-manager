import { ItemLogin } from "../../types/item";
import { ItemType } from "../../enums/item";
import LoginItem from "./Item/login";
import { searchStore } from "../../stores/search";
import { getTabUrl } from "../../utils/chrome/getTabUrl";
import { useEffect, useState } from "react";

export default function List() {
  const searchInput = searchStore((state) => state.searchInput);
  const [currentDomain, setCurrentDomain] = useState<undefined | string>(
    undefined
  );

  useEffect(() => {
    async function load() {
      const _url = await getTabUrl();
      if (_url) {
        let __url = new URL(_url as string);
        setCurrentDomain(__url.hostname);
      }
    }
    load();
  }, []);

  let items: ItemLogin[] = [
    {
      type: ItemType.LOGIN,
      name: "Google",
      uri: ["https://www.google.com"],
      username: "jinglescode@gmail.com",
      password: "123456",
    },
    {
      type: ItemType.LOGIN,
      name: "Nostr",
      uri: ["https://nostr.com"],
      username: "laoshu@gmail.com",
      password: "123456",
    },
  ];

  function filterItem(item: ItemLogin) {
    if (!searchInput) {
      if (currentDomain) {
        if (item.uri.some((v) => v.includes(currentDomain))) {
          return true;
        }
      } else {
        return true;
      }
    } else {
      const _searchInput = searchInput.trim().toLowerCase();

      if (item.name.toLowerCase().includes(_searchInput)) {
        return true;
      }

      if (item.username.toLowerCase().includes(_searchInput)) {
        return true;
      }

      if (item.uri.some((v) => v.includes(_searchInput))) {
        return true;
      }
    }

    return false;
  }

  return (
    <table className="min-w-full divide-y divide-gray-300">
      <tbody className="divide-y divide-gray-200 bg-white">
        {items.filter(filterItem).map((item, i) => {
          return <LoginItem key={i} item={item} />;
        })}
      </tbody>
    </table>
  );
}
