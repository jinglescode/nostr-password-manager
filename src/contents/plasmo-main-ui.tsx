import cssText from "data-text:~popup/style.css"

import type { PlasmoCSConfig } from "plasmo"
import { WalletMain } from "~components/Wallet"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"],
  world: "MAIN"
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default function PlasmoMainUI() {
  return <WalletMain />
}
