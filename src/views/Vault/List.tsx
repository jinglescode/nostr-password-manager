import { ItemKeys, ItemType } from "../../enums/item";
import LoginItem from "./Item/login";
import { searchStore } from "../../stores/search";
import { getTabUrl } from "../../utils/chrome/getTabUrl";
import { useEffect, useState } from "react";
import { List } from "../../types/list";
import { Item } from "../../types/item";
import { Virtuoso } from "react-virtuoso";

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
        let _domain = __url.hostname;
        _domain = _domain.replace("www.", "");
        setCurrentDomain(_domain);
      }
    }
    load();
  }, []);

  let lists: { [id: string]: List } = {
    id123: {
      id: "id123",
      mod: 12345,
      items: {
        item1: {
          ty: ItemType.LOGIN,
          na: "Google",
          login: {
            un: "jingle@gmail.com",
            pw: "123456",
            ur: ["https://google.com"],
          },
        },
        item2: {
          ty: ItemType.LOGIN,
          na: "Nostr",
          login: {
            un: "laoshu@gmail.com",
            pw: "123456",
            ur: ["https://nostr.com"],
          },
        },
        item3: {
          ty: ItemType.LOGIN,
          na: "Nostr1",
          login: {
            un: "laoshu@gmail.com",
            pw: "123456",
            ur: ["https://nostr.com"],
          },
        },
        item4: {
          ty: ItemType.LOGIN,
          na: "Nostr2",
          login: {
            un: "laoshu@gmail.com",
            pw: "123456",
            ur: ["https://nostr.com"],
          },
        },
        item5: {
          ty: ItemType.LOGIN,
          na: "Nostr3",
          login: {
            un: "laoshu@gmail.com",
            pw: "123456",
            ur: ["https://nostr.com"],
          },
        },
        item6: {
          ty: ItemType.LOGIN,
          na: "Nostr4",
          login: {
            un: "laoshu@gmail.com",
            pw: "123456",
            ur: ["https://nostr.com"],
          },
        },
        item7: {
          ty: ItemType.LOGIN,
          na: "Nostr5",
          login: {
            un: "laoshu@gmail.com",
            pw: "123456",
            ur: ["https://nostr.com"],
          },
        },
        item8: {
          ty: ItemType.LOGIN,
          na: "Nostr6",
          login: {
            un: "laoshu@gmail.com",
            pw: "123456",
            ur: ["https://nostr.com"],
          },
        },
        item9: {
          ty: ItemType.LOGIN,
          na: "Nostr7",
          login: {
            un: "laoshu@gmail.com",
            pw: "123456",
            ur: ["https://nostr.com"],
          },
        },
        item10: {
          ty: ItemType.LOGIN,
          na: "Nostr8 Nostr8 Nostr8 Nostr8 Nostr8 Nostr8 Nostr8 Nostr8 Nostr8 Nostr8 Nostr8 Nostr8 Nostr8 Nostr8 ",
          login: {
            un: "laoshulaoshulaoshulaoshulaoshulaoshulaoshulaoshulaoshulaoshulaoshu@gmail.com",
            pw: "123456",
            ur: ["https://nostr.com"],
          },
        },
        item11: {
          ty: ItemType.LOGIN,
          na: "Github",
          login: {
            un: "jingle@gmail.com",
            pw: "123456",
            ur: ["https://github.com"],
          },
        },
        item12: {
          ty: ItemType.LOGIN,
          na: "Nostr10",
          login: {
            un: "laoshu@gmail.com",
            pw: "123456",
            ur: ["https://nostr.com"],
          },
        },
        item13: {
          ty: ItemType.LOGIN,
          na: "Nostr11",
          login: {
            un: "laoshu@gmail.com",
            pw: "123456",
            ur: ["https://nostr.com"],
          },
        },
      },
    },
  };

  const items = Object.keys(lists)
    .map((listId) => {
      let list = lists[listId];
      return Object.keys(list.items).map((itemId) => {
        let item = list.items[itemId];
        item.listId = listId;
        return item;
      });
    })
    .reduce((acc, val) => acc.concat(val), [])
    .filter(filterItem)
    .sort(sort);

  console.log(44, items);

  // let items: ItemLogin[] = [
  //   {
  //     type: ItemType.LOGIN,
  //     name: "Google",
  //     uri: ["https://www.google.com"],
  //     username: "jinglescode@gmail.com",
  //     password: "123456",
  //   },
  //   {
  //     type: ItemType.LOGIN,
  //     name: "Nostr",
  //     uri: ["https://nostr.com"],
  //     username: "laoshu@gmail.com",
  //     password: "123456",
  //   },
  // ];

  function sort(a: Item, b: Item) {
    if (!searchInput) {
      if (a.login && b.login) {
        if (currentDomain) {
          if (a.login[ItemKeys.URI].some((v) => v.includes(currentDomain))) {
            console.log(555, a.login[ItemKeys.URI]);
            return -1;
          }
          if (b.login[ItemKeys.URI].some((v) => v.includes(currentDomain))) {
            console.log(666, a.login[ItemKeys.URI]);
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
    // <table className="min-w-full divide-y divide-gray-300">
    //   <tbody className="divide-y divide-gray-200 bg-white">
    //     {/* {items.filter(filterItem).map((item, i) => {
    //       return <LoginItem key={i} item={item} />;
    //     })} */}
    //     <Virtuoso
    //       style={{ height: "100%" }}
    //       data={items}
    //       itemContent={(index, item) => rowRenderer({ index, item })}
    //     />
    //   </tbody>
    // </table>

    <Virtuoso
      style={{ height: "100%" }}
      data={items}
      itemContent={(index, item) => rowRenderer({ index, item })}
    />
  );
}
