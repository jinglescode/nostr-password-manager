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
  getLocalStorage,
  getSessionStorage,
  setLocalStorage,
  setSessionStorage,
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
        title: "Something went wrong!",
        message: "Failed to update your vault. Please try again.",
        type: "error",
      });
    }
  }, [isSuccess, isError]);

  async function processUpdatePart2() {
    if (!firstNewPassInput) return;

    // update encrypted secret key

    const passcode = await getSessionStorage(StorageKeys.SESSION_USER_PASSCODE);

    const oldEncryptedSK = await getLocalStorage(
      StorageKeys.LOCAL_USER_ENCRYPTED_SK
    );

    const { encryptString, decryptString } = new StringCrypto();

    const sk = decryptString(oldEncryptedSK, passcode);

    let newEncryptedSK = encryptString(sk, firstNewPassInput);

    setLocalStorage(StorageKeys.LOCAL_USER_ENCRYPTED_SK, newEncryptedSK);
    setSessionStorage(StorageKeys.SESSION_USER_PASSCODE, firstNewPassInput);

    // close
    setAppNotification({
      title: "Passcode updated",
      message: "Use your new passcode to unlock your vault.",
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
    event.tags = [["d", vault.id]];

    mutate(event);
  }

  async function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (input.length < 6) {
        setAppNotification({
          title: "Passcode too short",
          message: "Passcode must be at least 6 characters.",
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
            title: "Wrong passcode",
            message: "Please try again.",
            type: "error",
          });
        }
      } else if (firstNewPassInput === undefined) {
        setFirstNewPassInput(input);
      } else if (firstNewPassInput == input) {
        processUpdate();
      } else if (firstNewPassInput != input) {
        setAppNotification({
          title: "Passcode not match",
          message: "Please try again.",
          type: "error",
        });
      }
      setInput("");
    }
  }

  return (
    <SettingItem
      label="Passcode"
      value={
        <>
          {isEdit ? (
            <Input
              label={
                existingPassInput === undefined
                  ? "Existing passcode"
                  : firstNewPassInput === undefined
                  ? "New passcode"
                  : "Repeat your new passcode"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`At least 6 characters`}
              disabled={!ndk || !signer || !data || !user}
              onKeyUp={handleKeyUp}
              type="password"
            />
          ) : (
            <p>Passcode is needed to decrypt your data.</p>
          )}
        </>
      }
      buttonLabel={isEdit ? undefined : "Update"}
      buttonOnClick={() => {
        setIsEdit(!isEdit);
      }}
    />
  );
}