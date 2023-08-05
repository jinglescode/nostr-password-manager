export function getStorage(key: string, callback: (data: any) => void) {
  chrome.storage.sync.get([key], (result) => {
    callback(result[key]);
  });
}

export function setStorage(key: string, value: any, callback?: () => void) {
  chrome.storage.sync.set({ [key]: value }, () => {
    if (callback) callback();
  });
}
