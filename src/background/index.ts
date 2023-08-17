import injectNostr from "./inject-nostr"

const inject = async (tabId: number) => {
  chrome.scripting.executeScript(
    {
      target: {
        tabId
      },
      world: "MAIN",
      func: injectNostr
    },
    () => {
      console.log("window.nostr injected")
    }
  )
}
chrome.tabs.onActivated.addListener((e) => {
  inject(e.tabId)
})