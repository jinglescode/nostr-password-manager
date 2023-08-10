export async function getTabs(): Promise<chrome.tabs.Tab[]> {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query({}, (tabs) => {
        resolve(tabs);
      });
    } catch (e) {
      reject(e);
    }
  });
}
