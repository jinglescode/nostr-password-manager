// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.action.setBadgeBackgroundColor({ color: "#5593FE" });

// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  // console.log('background request:', request)
// });
