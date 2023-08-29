import { Disclosure } from "@headlessui/react"
import {
  BookOpenIcon,
  MinusSmallIcon,
  PencilSquareIcon,
  PlusSmallIcon,
  TrashIcon
} from "@heroicons/react/20/solid"
import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"
import { SecureStorage } from "@plasmohq/storage/secure"

import Button from "~components/Button"
import Tooltip from "~components/Tooltip"
import { StorageKeys } from "~enums/storage"
import type { NostrKey, NostrKeys } from "~types/nostrKeys"
import { getSessionStorage, getSyncStorage } from "~utils/chrome/storage"
import { getPublicKeys } from "~utils/nostr/getPublicKeys"

const secureStorage = new SecureStorage()
const storage = new Storage(
//   {
//   area: "local"
// }
)

export default function NostrView() {
  const [nostrKeys, setNostrKeys] = useState<NostrKeys>({})

  async function initKey() {
    const pk = await getSyncStorage(StorageKeys.LOCAL_USER_PK)
    const sk = await getSessionStorage(StorageKeys.SESSION_USER_SK)

    const keyData: NostrKey = {
      name: "main",
      sk: sk,
      apps: {}
    }

    const initKeyData = {
      [pk]: keyData
    }

    await secureStorage.set("nostr-keys", JSON.stringify(initKeyData))
    const data = await secureStorage.get("nostr-keys")
    console.log(44, "data nostr-keys set", data)

    setNostrKeys(initKeyData)
  }

  useEffect(() => {
    async function load() {
      const passcode = await getSessionStorage(
        StorageKeys.SESSION_USER_PASSCODE
      )
      console.log(11, "passcode", passcode)

      if (passcode) {
        await secureStorage.setPassword(passcode)

        await storage.set("nostr-keys", JSON.stringify({ passcode }))

        const data = await secureStorage.get("nostr-keys")
        console.log(22, "data", data)

        if (data === undefined) await initKey()
        else {
          const _nostrKeys = JSON.parse(data)
          setNostrKeys(_nostrKeys)
        }
      }
    }
    load()
  }, [])

  return (
    <div className="w-full h-full">
      <dl className="mx-4 space-y-2 divide-y divide-gray-900/10 pb-2">
        {Object.keys(nostrKeys).map((pk) => {
          return <Key data={nostrKeys[pk]} key={pk} pk={pk} />
        })}
        <Button onClick={() => {}}>Add more keys</Button>
      </dl>
    </div>
  )
}

function Key({ data, pk }: { data: NostrKey; pk: string }) {
  const npub = getPublicKeys(pk).npub

  return (
    <Disclosure as="div" className="pt-2">
      {({ open }) => (
        <>
          <dt>
            <Disclosure.Button className="flex w-full items-center justify-between text-left">
              <div className="flex-grow overflow-x-hidden">
                <p className="text-base text-brand-black font-semibold leading-7 text-ellipsis overflow-hidden">
                  {data.name}
                </p>
                <p className="text-brand-gray text-ellipsis overflow-x-hidden">
                  {npub.substring(0, 15)}...
                  {npub.substring(npub.length - 15)}
                </p>
              </div>
              <span className="ml-6 flex h-7 items-center text-brand-gray">
                {open ? (
                  <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                )}
              </span>
            </Disclosure.Button>
          </dt>
          <Disclosure.Panel as="dd" className="">
            {/* <p className="text-brand-gray text-sm">{faq.answer}</p> */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full py-2 align-middle">
                <table className="min-w-full divide-y divide-gray-300">
                  {/* <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                        Site
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Permissions
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Validity
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead> */}
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {Object.keys(data.apps).map((url) => {
                      const site = data.apps[url]
                      return (
                        <tr key={url}>
                          <td className="whitespace-nowrap p-2">
                            <p className="truncate w-64 text-sm font-medium text-gray-900">
                              {url}
                            </p>
                          </td>
                          {/* <td className="whitespace-nowrap p-2 flex gap-2">
                          <Tooltip
                            info={`Read allowed`}>
                            <BookOpenIcon className="h-5 w-5 text-gray-400" />
                          </Tooltip>
                          <PencilSquareIcon className="h-5 w-5 text-gray-400" />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          Forever
                        </td> */}
                          <td className="text-right">
                            <button
                              // onClick={() => delete(index)}
                              className="text-brand-gray-light hover:text-primary"
                              title={`Delete`}>
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
