import {
  getEventHash,
  getPublicKey,
  getSignature,
  nip19,
  validateEvent
} from "nostr-tools"
import { useEffect, useState } from "react"

export const WalletMain = () => {
  const [display, setDisplay] = useState<boolean>(false)

  useEffect(() => {
    window.addEventListener("message", (event) => {
      console.log(111, event)

      const { id, type, params } = event.data
      console.log(222, id, type, params)

      if (type === "getPublicKey") {
        console.log(333, "getPublicKey")

        // // todo, get from storage, the current selected sk
        const res = getPublicKey(
          ""
        )
        console.log(444, res)
        window.nostr._requests[id].resolve(res)

        setDisplay(true)
      }
    })
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
