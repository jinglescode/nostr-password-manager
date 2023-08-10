"use strict";

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

/**
 * autofill login forms
 * could be inspiration: https://github.com/bitwarden/clients/blob/38e4ba087930e491628435201b4796fb4bfe8463/src/services/autofill.service.ts
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "FILLFORM") {
    autofill(request.payload.username, request.payload.password);

    sendResponse({
      type: "FILLFORMRES",
      payload: {},
    });
  }
});

function autofill(username, password) {
  var inputs = document.getElementsByTagName("input");

  for (const input of inputs) {
    {
      if (
        input.type == "password" &&
        (input.name.toLowerCase().indexOf("auth") == -1 ||
          input.name.toLowerCase() == "loginform:password")
      ) {
        {
          input.value = password;
        }
      }
      if (
        (input.type == "text" || input.type == "email") &&
        (input.name.toLowerCase().indexOf("login") != -1 ||
          input.name.toLowerCase().indexOf("user") != -1 ||
          input.name.toLowerCase().indexOf("identifier") != -1 ||
          input.name == "AgentAccount" ||
          input.autocomplete.toLowerCase().indexOf("username") != -1 ||
          input.name.toLowerCase() == "loginform:username")
      ) {
        {
          input.value = username;
        }
      }
    }
  }
}

/**
 * window.nostr NIP07 login
 * inspiration: https://github.com/fiatjaf/nos2x/blob/master/extension/content-script.js
 */

// import browser from "webextension-polyfill";

// // inject script into page
// let script = document.createElement("script");
// script.setAttribute("async", "false");
// script.setAttribute("type", "text/javascript");
// script.setAttribute("src", browser.runtime.getURL("nostr-provider.js"));
// document.head.appendChild(script);

// // listen for messages from that script
// window.addEventListener("message", async (message) => {
//   if (message.source !== window) return;
//   if (!message.data) return;
//   if (!message.data.params) return;
//   if (message.data.ext !== "vault") return;

//   // pass on to background
//   var response;
//   try {
//     response = await browser.runtime.sendMessage({
//       type: message.data.type,
//       params: message.data.params,
//       host: location.host,
//     });
//   } catch (error) {
//     response = { error };
//   }

//   // return response
//   // window.postMessage(
//   //   {id: message.data.id, ext: 'vault', response},
//   //   message.origin
//   // )
// });



// Communicate with background file by sending a message
// chrome.runtime.sendMessage(
//   {
//     type: "ATYPEHERE",
//     payload: {
//       message: "DATA",
//     },
//   },
//   (response) => {
//     console.log(response.message);
//   }
// );