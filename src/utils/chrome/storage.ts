export function getLocalStorage(key: string): any {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key]);
    });
  });
}

export function setLocalStorage(key: string, value: any) {
  chrome.storage.local.set({ [key]: value }, () => {});
}

export function clearLocalStorage() {
  chrome.storage.local.clear();
}

export function getSessionStorage(key: string): any {
  return new Promise(function (resolve, reject) {
    chrome.storage.session.get([key], (result) => {
      resolve(result[key]);
    });
  });
}

export function setSessionStorage(key: string, value: any) {
  chrome.storage.session.set({ [key]: value }, () => {});
}

export function clearSessionStorage() {
  chrome.storage.session.clear();
}
