import { useEffect, useState } from "react";
import SettingItem from "../SettingItem";
import Input from "../../../components/Input";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { viewStore } from "../../../stores/view";
import { useUserVaults } from "../../../hooks/useUserVaults";
import { decryptVaults } from "../../../utils/encryption/decryptVaults";
import { accountStore } from "../../../stores/account";
import { Vault } from "../../../types/vault";
import { encryptVault } from "../../../utils/encryption/encryptVault";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useUserVaultsPost } from "../../../hooks/useUserVaultsPost";
import {
  getSessionStorage,
  getSyncStorage,
  setSessionStorage,
  setSyncStorage,
} from "../../../utils/chrome/storage";
import { StorageKeys } from "../../../enums/storage";
import StringCrypto from "string-crypto";

export default function SettingsAccountPasscode() {
  const { ndk, signer } = useNDK();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [existingPassInput, setExistingPassInput] = useState<
    string | undefined
  >(undefined);
  const [firstNewPassInput, setFirstNewPassInput] = useState<
    string | undefined
  >(undefined);
  const setAppNotification = viewStore((state) => state.setAppNotification);
  const { data } = useUserVaults();
  const user = accountStore((state) => state.user);
  const { mutate, isSuccess, isError } = useUserVaultsPost();

  useEffect(() => {
    if (isSuccess) {
      processUpdatePart2();
    }
    if (isError) {
      setAppNotification({
        title: chrome.i18n.getMessage("notification_something_wrong"),
        message: chrome.i18n.getMessage("notification_vault_updated_fail"),
        type: "error",
      });
    }
  }, [isSuccess, isError]);

  // update existing passcode and sk
  async function processUpdatePart2() {
    if (!firstNewPassInput) return;

    // update encrypted secret key

    const passcode = await getSessionStorage(StorageKeys.SESSION_USER_PASSCODE);

    const oldEncryptedSK = await getSyncStorage(
      StorageKeys.LOCAL_USER_ENCRYPTED_SK
    );

    const { encryptString, decryptString } = new StringCrypto();

    const sk = decryptString(oldEncryptedSK, passcode);

    let newEncryptedSK = encryptString(sk, firstNewPassInput);

    setSyncStorage(StorageKeys.LOCAL_USER_ENCRYPTED_SK, newEncryptedSK);
    setSessionStorage(StorageKeys.SESSION_USER_PASSCODE, firstNewPassInput);

    // close
    setAppNotification({
      title: chrome.i18n.getMessage("notification_passcode_updated"),
      message: chrome.i18n.getMessage("notification_passcode_updated_message"),
      type: "success",
    });

    setInput("");
    setExistingPassInput(undefined);
    setFirstNewPassInput(undefined);
    setIsEdit(false);
  }

  async function processUpdate() {
    if (!ndk || !signer || !data || !firstNewPassInput) return;

    // decrypt with old passcode

    const passcode = await getSessionStorage(StorageKeys.SESSION_USER_PASSCODE);

    // if have data to decrypt
    if (data.length > 0) {
      const decryptedVaults = await decryptVaults({
        signer,
        vaults: data,
        passcode: passcode,
      });

      // future: handle multiple vaults
      let vault: Vault = decryptedVaults[Object.keys(decryptedVaults)[0]];

      // encrypt with new passcode
      const encryptedItems = await encryptVault({
        vault,
        signer,
        passcode: firstNewPassInput,
      });

      // sync nostr data

      const event = new NDKEvent();
      event.kind = 34567;
      event.content = encryptedItems;
      event.tags = [
        ["d", vault.id],
        ["v", "1"],
      ];

      mutate(event);
    }
    // if no data to decrypt, just update passcode
    else {
      processUpdatePart2();
    }
  }

  async function processInput() {
    if (input.length < 6) {
      setAppNotification({
        title: chrome.i18n.getMessage("notification_passcode_too_short"),
        message: chrome.i18n.getMessage(
          "notification_passcode_too_short_message"
        ),
        type: "error",
      });
      return;
    }

    if (existingPassInput === undefined) {
      const passcode = await getSessionStorage(
        StorageKeys.SESSION_USER_PASSCODE
      );

      if (input === passcode) {
        setExistingPassInput(input);
      } else {
        setAppNotification({
          title: chrome.i18n.getMessage("notification_passcode_wrong"),
          message: chrome.i18n.getMessage(
            "notification_passcode_wrong_message"
          ),
          type: "error",
        });
      }
    } else if (firstNewPassInput == undefined) {
      setFirstNewPassInput(input);
    } else if (firstNewPassInput == input) {
      processUpdate();
    } else if (firstNewPassInput != input) {
      setAppNotification({
        title: chrome.i18n.getMessage("notification_passcode_not_match"),
        message: chrome.i18n.getMessage(
          "notification_passcode_not_match_message"
        ),
        type: "error",
      });
    }
    setInput("");
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      processInput();
    }
  }

  return (
    <SettingItem
      label={chrome.i18n.getMessage("settings_passcode")}
      value={
        <>
          {isEdit ? (
            <>
              <Input
                label={
                  existingPassInput === undefined
                    ? chrome.i18n.getMessage("form_existing_passcode")
                    : firstNewPassInput === undefined
                    ? chrome.i18n.getMessage("form_new_passcode")
                    : chrome.i18n.getMessage("form_new_passcode_repeat")
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={chrome.i18n.getMessage("form_passcode_6_chars")}
                disabled={!ndk || !signer || !data || !user}
                onKeyUp={handleKeyUp}
                type="password"
                after={
                  <div
                    className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 cursor-pointer"
                    onClick={() => processInput()}
                  >
                    <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-brand-gray-light">
                      enter
                    </kbd>
                  </div>
                }
              />
              {firstNewPassInput !== undefined && (
                <p className="mt-4">
                  <a
                    onClick={() => {
                      setFirstNewPassInput(undefined);
                      setInput("");
                    }}
                    className="cursor-pointer text-brand-2 hover:text-primary text-sm leading-6"
                  >
                    {chrome.i18n.getMessage("settings_reenter_passcode")}
                  </a>
                </p>
              )}
            </>
          ) : (
            <p>{chrome.i18n.getMessage("settings_passcode_tip")}</p>
          )}
        </>
      }
      buttonLabel={isEdit ? undefined : chrome.i18n.getMessage("button_update")}
      buttonOnClick={() => {
        setIsEdit(!isEdit);
      }}
    />
  );
}
