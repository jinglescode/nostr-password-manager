import { useEffect, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { Views, viewStore } from "../../stores/view";
import { EditItemViews, ItemKeys, ItemType } from "../../enums/item";
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useUserVaults } from "../../hooks/useUserVaults";
import { Item } from "../../types/item";
import { makeId } from "../../utils/strings/makeId";
import LoginItem from "./LoginItem";
// import { getTabs } from "../../utils/chrome/getTabs";
import { Vault } from "../../types/vault";
import { useUserVaultsPost } from "../../hooks/useUserVaultsPost";
import { decryptVaults } from "../../utils/encryption/decryptVaults";
import { accountStore } from "../../stores/account";
import { getActiveTab } from "../../utils/chrome/getActiveTab";
import { generatePassword } from "../../utils/strings/passwordGenerator";

export default function ItemView() {
  const { ndk, signer } = useNDK();
  const { data } = useUserVaults();

  const setView = viewStore((state) => state.setView);
  const itemDetails = viewStore((state) => state.itemDetails);
  const setAppNotification = viewStore((state) => state.setAppNotification);
  const user = accountStore((state) => state.user);

  const { mutate, isSuccess, isError } = useUserVaultsPost();

  const [isNew, setIsNew] = useState<boolean>(false); // is a new item
  const [mode, setMode] = useState<EditItemViews>(EditItemViews.VIEW); // view or edit
  const [editableItem, setEditableItem] = useState<Item | undefined>(undefined);

  useEffect(() => {
    async function createNewItem() {
      console.log(6, itemDetails);
      if (itemDetails) {
        setEditableItem(itemDetails);
      } else {
        let url = "";
        let name = "";

        const tab = await getActiveTab();
        console.log(222, tab);

        if (tab) {
          url = tab.url || "";
          name = tab.title || "";
        }

        const password = await generatePassword();

        const newItem = {
          id: makeId(),
          [ItemKeys.TYPE]: ItemType.LOGIN,
          [ItemKeys.NAME]: name,
          login: {
            [ItemKeys.USERNAME]: "",
            [ItemKeys.PASSWORD]: password,
            [ItemKeys.URI]: [url],
          },
        };
        setIsNew(true);
        setEditableItem(newItem);
        setMode(EditItemViews.EDIT);
      }
    }
    createNewItem();
  }, [itemDetails]);

  useEffect(() => {
    if (isSuccess) {
      setAppNotification({
        title: "Success!",
        message: "Your vault is updated successfully!",
        type: "success",
      });
      setView(Views.VAULT);
    }
    if (isError) {
      setAppNotification({
        title: "Something went wrong!",
        message: "Failed to update your vault. Please try again.",
        type: "error",
      });
    }
  }, [isSuccess, isError]);

  function validate() {
    if (editableItem === undefined) return false;
    if (editableItem[ItemKeys.NAME] === "") return false;
    //@ts-ignore
    if (editableItem.login[ItemKeys.USERNAME] === "") return false;
    //@ts-ignore
    if (editableItem.login[ItemKeys.PASSWORD] === "") return false;
    return true;
  }

  async function save(isDelete?: boolean) {
    if (data === undefined) return;
    if (editableItem === undefined) return;
    if (user === undefined) return;
    if (!signer) return;

    if (!validate && !isDelete) return;

    // 1. get list

    const decryptedVaults = await decryptVaults({
      signer,
      vaults: data,
      user,
    });

    let vault: Vault = {
      id: "main",
      mod: 0,
      items: {},
      encryptedItems: "",
    };

    // 1a. if 1 vault, get that vault

    if (Object.keys(decryptedVaults).length === 1) {
      vault = decryptedVaults[Object.keys(decryptedVaults)[0]];
    }

    // 1b. if has more than 1 list, get from selected list, todo future

    // 2. update item to list
    if (isDelete) {
      delete vault.items[editableItem.id];
    } else {
      vault.items[editableItem.id] = editableItem;
    }

    console.log(5, "item", editableItem);
    console.log(6, "saving vault", vault);

    mutate(vault);
  }

  async function deleteItem() {
    setAppNotification({
      title: "Delete item?",
      message: "Are you sure you want to delete this item?",
      type: "confirm",
      onConfirm: () => {
        save(true);
      },
    });
  }

  function onChangeFormInput({
    key,
    value,
    isLogin,
    uriIndex,
  }: {
    key: string;
    value: string;
    isLogin?: boolean;
    uriIndex?: number;
  }) {
    if (editableItem === undefined) return;

    let _updatedItem = { ...editableItem };
    if (uriIndex !== undefined) {
      //@ts-ignore
      _updatedItem.login[ItemKeys.URI][uriIndex] = value;
    } else if (isLogin) {
      //@ts-ignore
      _updatedItem.login[key] = value;
    } else {
      //@ts-ignore
      _updatedItem[key] = value;
    }
    setEditableItem(_updatedItem);
  }

  return (
    <div className="w-full p-2 space-y-2">
      <Input
        label="Name"
        name="name"
        placeholder="something to identify this item"
        value={editableItem?.[ItemKeys.NAME] || ""}
        onChange={(e) =>
          onChangeFormInput({ key: ItemKeys.NAME, value: e.target.value })
        }
        disabled={mode === EditItemViews.VIEW}
      />

      {editableItem?.[ItemKeys.TYPE] == "lo" && (
        <LoginItem
          editableItem={editableItem}
          onChangeFormInput={onChangeFormInput}
          mode={mode}
          isNew={isNew}
          setEditableItem={setEditableItem}
        />
      )}

      <div className="mt-20 grid grid-cols-6 gap-2">
        {mode == EditItemViews.VIEW ? (
          <>
            <Button
              disabled={ndk === undefined}
              onClick={() => setMode(EditItemViews.EDIT)}
              title="Unlock to edit"
            >
              <div className="flex flex-col items-center">
                <LockClosedIcon className="h-4 w-4" />
                <span className="text-xs">Edit</span>
              </div>
            </Button>
          </>
        ) : (
          <>
            {!isNew && (
              <Button
                onClick={() => setMode(EditItemViews.VIEW)}
                title="Lock to exit editing mode"
              >
                <div className="flex flex-col items-center">
                  <LockOpenIcon className="h-4 w-4" />
                  <span className="text-xs">Lock</span>
                </div>
              </Button>
            )}
            <Button
              disabled={ndk === undefined || !validate()}
              onClick={() => save()}
              title="Save changes"
            >
              <div className="flex flex-col items-center">
                <CloudArrowUpIcon className="h-4 w-4" />
                <span className="text-xs">Save</span>
              </div>
            </Button>
            {!isNew && (
              <Button
                onClick={() => deleteItem()}
                className="bg-red-800 hover:bg-red-600"
                title="Delete item"
              >
                <div className="flex flex-col items-center">
                  <TrashIcon className="h-4 w-4" />
                  <span className="text-xs">Delete</span>
                </div>
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
