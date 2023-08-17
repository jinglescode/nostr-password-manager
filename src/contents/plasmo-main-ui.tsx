import type { PlasmoCSConfig } from "plasmo"

import { WalletMain } from "~components/Wallet"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"],
  world: "MAIN"
}

export default function PlasmoMainUI() {
  return <WalletMain />
}
