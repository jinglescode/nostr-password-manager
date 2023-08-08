"use strict";

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  // if (request.type === "ATYPEHERE") {
  //   sendResponse({
  //     message,
  //   });
  // }
});
