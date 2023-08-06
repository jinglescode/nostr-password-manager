export function getLocalStorage(key: string, callback: (data: any) => void) {
  chrome.storage.local.get([key], (result) => {
    callback(result[key]);
  });
}

export function setLocalStorage(
  key: string,
  value: any,
  callback?: () => void
) {
  chrome.storage.local.set({ [key]: value }, () => {
    if (callback) callback();
  });
}

export function clearLocalStorage() {
  chrome.storage.local.clear();
}

export function getSessionStorage(key: string, callback: (data: any) => void) {
  chrome.storage.session.get([key], (result) => {
    callback(result[key]);
  });
}

export function setSessionStorage(
  key: string,
  value: any,
  callback?: () => void
) {
  chrome.storage.session.set({ [key]: value }, () => {
    if (callback) callback();
  });
}

export function clearSessionStorage() {
  chrome.storage.session.clear();
}
