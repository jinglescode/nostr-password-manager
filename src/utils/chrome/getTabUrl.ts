export async function getTabUrl() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (tabs) {
        let url = tabs[0].url;
        if (url) resolve(url);
      }
      reject();
    });
  });
}
