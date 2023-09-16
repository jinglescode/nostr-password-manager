import type { PlasmoMessaging } from "@plasmohq/messaging"
import { SecureStorage } from "@plasmohq/storage/secure"

import { MESSAGE } from "~messages"

const secureStorage = new SecureStorage()

async function getPublicKey(req, res) {
  const hasAllowed = !secureStorage.isValidKey("nostr-keys")

  console.log(11, hasAllowed)

  if (!hasAllowed) {
    res.send({
      type: MESSAGE.RequestDecryptPassword,
      data: {
        requestId: req.body.requestId
      }
    })
  } else {
    const data = await secureStorage.get("nostr-keys")

    if (data) {
      console.log(333, " nostr-keys data", data)

      const keys: {} = JSON.parse(data)
      if (keys) {
        if (Object.keys(keys).length > 1) {
          // todo show user wallet selection
        } else {
          res.send({
            type: MESSAGE.WalletSelected,
            data: {
              requestId: req.body.requestId,
              pubkey: Object.keys(keys)[0]
            }
          })
        }
      }
    } else {
      res.send({
        type: MESSAGE.RequestDecryptPassword,
        data: {
          requestId: req.body.requestId,
          error: MESSAGE.InvalidPassword
        }
      })
    }
  }
}

async function signEvent(req, res) {
  console.log("signEvent", req)
  // todo sign the event

  res.send({
    type: MESSAGE.SignEventApproved,
    data: {
      requestId: req.body.requestId
    }
  })
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  if (req.body.type === MESSAGE.SetDecryptPassword) {
    await secureStorage.setPassword(req.body.data.password)
    await getPublicKey(req, res)
  }

  if (req.body.type === MESSAGE.RequestPubkey) {
    await getPublicKey(req, res)
  }

  if (req.body.type === MESSAGE.RequestSignEvent) {
    await signEvent(req, res)
  }
}

export default handler
