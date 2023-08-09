"use strict";

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

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

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "FILLFORM") {
    autofill(request.payload.username, request.payload.password);

    sendResponse({
      type: "FILLFORMRES",
      payload: {},
    });
  }
});

// could be inspiration: https://github.com/bitwarden/clients/blob/38e4ba087930e491628435201b4796fb4bfe8463/src/services/autofill.service.ts
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
