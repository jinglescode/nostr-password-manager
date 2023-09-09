import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"
import { relay } from "@plasmohq/messaging/relay"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"]
}

relay(
  {
    name: "nostr" as const
  },
  async (req) => {
    return await sendToBackground(req)
  }
)
