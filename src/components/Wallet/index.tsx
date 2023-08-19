import {
  getEventHash,
  getPublicKey,
  getSignature,
  nip19,
  validateEvent
} from "nostr-tools"
import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { SecureStorage } from "@plasmohq/storage/secure"

import { StorageKeys } from "~enums/storage"
import { getSessionStorage } from "~utils/chrome/storage"

const storage = new Storage(
  //   {
  //   area: "local"
  // }
)

// const secureStorage = new SecureStorage()

export const WalletMain = () => {
  const [nostrSession, setNostrSession] = useStorage("nostr-session")

  const [display, setDisplay] = useState<boolean>(false)

  async function newEvent() {

    console.log(111, nostrSession);

    // const passcode = await getSessionStorage(StorageKeys.SESSION_USER_PASSCODE)
    // console.log(1111, "passcode", passcode)

    const data = await storage.get("nostr-session")
    console.log(222, " nostr-session data", data)

    // await storage.set("nostr-session", "session state")

    // const data2 = await storage.get("nostr-session")
    // console.log(333, " nostr-session data", data2)

    // await secureStorage.setPassword("")

    // const data3 = await secureStorage.get("nostr-keys")
    // console.log(444, "data", data3)

    // setNostrSession("session state")
  }

  

  useEffect(() => {
    async function load() {
      window.addEventListener("message", (event) => {
        const { id, type, params } = event.data

        if (type === "getPublicKey") {
          newEvent()

          //////
          // console.log(333, "getPublicKey", id, type, params)

          // // // todo, get from storage, the current selected sk
          // const res = getPublicKey("")
          // console.log(444, res)
          // window.nostr._requests[id].resolve(res)

          // setDisplay(true)
        }
      })
    }

    load()
  }, [])

  return (
    <>
      {display && (
        <div
          className="z-50 flex fixed top-32 right-8"
          style={{
            padding: 8,
            background: "purple",
            color: "white"
          }}>
          hello!
        </div>
      )}
    </>
  )
}
