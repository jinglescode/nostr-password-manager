import type { PlasmoMessaging } from "@plasmohq/messaging"
import { SecureStorage } from "@plasmohq/storage/secure"

import { MESSAGE } from "~messages"

const secureStorage = new SecureStorage()

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("open-extension", req)
  const message = "Hello from the background script!"

  const hasAllowed = !secureStorage.isValidKey("nostr-keys")

  console.log(11, hasAllowed)

  if (!hasAllowed) {
    res.send({
      type: MESSAGE.RequestDecryptPassword,
      message
    })
  } else {
    const data2 = await secureStorage.get("nostr-keys")
    console.log(333, " nostr-keys data", data2)

    res.send({
      message
    })
  }
}

export default handler
