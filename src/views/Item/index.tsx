import { useEffect, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { Views, viewStore } from "../../stores/view";
import { ItemKeys, ItemType } from "../../enums/item";
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useClipboard } from "../../hooks/useCopyClipboard";
import { useUserVaults } from "../../hooks/useUserVaults";
import { List } from "../../types/list";
import { Item } from "../../types/item";
import { makeId } from "../../utils/strings/makeId";
import { getTabUrl } from "../../utils/chrome/getTabUrl";

enum Mode {
  EDIT,
  VIEW,
}

export default function ItemView() {
  const { ndk } = useNDK();
  const { data } = useUserVaults();

  const setView = viewStore((state) => state.setView);

  const itemDetails = viewStore((state) => state.itemDetails);

  const [isNew, setIsNew] = useState<boolean>(false); // is a new item
  const [mode, setMode] = useState<Mode>(Mode.VIEW); // view or edit
  const [editableItem, setEditableItem] = useState<Item | undefined>(undefined);

  useEffect(() => {
    async function createNewItem() {
      console.log(6, itemDetails);
      if (itemDetails) {
        setEditableItem(itemDetails);
      } else {
        let url = "";
        try {
          url = (await getTabUrl()) as string;
        } catch (err) {}
        console.log(7, url);
        setIsNew(true);
        setMode(Mode.EDIT);
        const newItem = {
          id: makeId(),
          [ItemKeys.TYPE]: ItemType.LOGIN,
          [ItemKeys.NAME]: "",
          login: {
            [ItemKeys.USERNAME]: "",
            [ItemKeys.PASSWORD]: "",
            [ItemKeys.URI]: [url],
          },
        };
        setEditableItem(newItem);
      }
    }
    createNewItem();
  }, [itemDetails]);

  // login
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const { onCopy: copyUser } = useClipboard(
    editableItem?.login?.[ItemKeys.USERNAME] || ""
  );
  const { onCopy: copyPassword } = useClipboard(
    editableItem?.login?.[ItemKeys.PASSWORD] || ""
  );

  function generatePassword() {}

  function validate() {
    if (editableItem === undefined) return false;
    if (editableItem[ItemKeys.NAME] === "") return false;
    //@ts-ignore
    if (editableItem.login[ItemKeys.USERNAME] === "") return false;
    //@ts-ignore
    if (editableItem.login[ItemKeys.PASSWORD] === "") return false;
    //@ts-ignore
    if (editableItem.login[ItemKeys.URI].length === 0) return false;

    return true;
  }

  async function save() {
    if (data === undefined) return;
    if (editableItem === undefined) return;
    if (!validate) return;

    // 1. get list

    let list: List = data[0];

    // 1a. if no list, create a new list

    if (data.length === 0) {
      list = {
        id: "main",
        mod: 0,
        items: {},
      };
    }

    // 1b. if has more than 1 list, get from selected list, todo future

    // 2. update item to list
    list.items[editableItem.id] = editableItem;

    console.log(5, "saving item", editableItem);
    console.log(6, "saving list", list);

    // todo save to relay
    // setView(Views.VAULT);
  }

  // todo
  async function deleteItem() {}

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

    console.log(3, key, value, isLogin, uriIndex);
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
    console.log(4, _updatedItem);
  }

  function deleteUri(index: number) {
    if (editableItem === undefined) return;
    //@ts-ignore
    const _updatedItem = { ...editableItem };
    //@ts-ignore
    _updatedItem.login[ItemKeys.URI].splice(index, 1);
    setEditableItem(_updatedItem);
  }

  function addUriRow() {
    if (editableItem === undefined) return;
    //@ts-ignore
    const _updatedItem = { ...editableItem };
    //@ts-ignore
    _updatedItem.login[ItemKeys.URI].push("");
    setEditableItem(_updatedItem);
  }

  console.log(9, "editableItem", editableItem);
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
        disabled={mode === Mode.VIEW}
      />
      {editableItem?.[ItemKeys.TYPE] == "lo" && (
        <>
          <Input
            label="Username"
            name="username"
            placeholder="login username"
            value={editableItem?.login?.[ItemKeys.USERNAME] || ""}
            onChange={(e) =>
              onChangeFormInput({
                key: ItemKeys.USERNAME,
                value: e.target.value,
                isLogin: true,
              })
            }
            disabled={mode === Mode.VIEW}
            after={
              !isNew && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <button
                    onClick={() => copyUser()}
                    className="text-gray-400 hover:text-brand-3 active:text-primary"
                    title="Copy username"
                  >
                    <DocumentDuplicateIcon className="h-6 w-6" />
                  </button>
                </div>
              )
            }
          />
          <Input
            label="Password"
            name="password"
            type={isShowPassword ? "text" : "password"}
            placeholder="login password"
            value={editableItem?.login?.[ItemKeys.PASSWORD] || ""}
            onChange={(e) =>
              onChangeFormInput({
                key: ItemKeys.PASSWORD,
                value: e.target.value,
                isLogin: true,
              })
            }
            disabled={mode === Mode.VIEW}
            after={
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                {mode == Mode.EDIT && (
                  <button
                    onClick={() => generatePassword()}
                    className="text-gray-400 hover:text-brand-3 active:text-primary"
                    title="Generate password"
                  >
                    <ArrowPathIcon className="h-6 w-6" />
                  </button>
                )}
                <button
                  onClick={() => setIsShowPassword(!isShowPassword)}
                  className="text-gray-400 hover:text-brand-3 active:text-primary"
                  title={isShowPassword ? "Hide password" : "Show password"}
                >
                  {isShowPassword ? (
                    <EyeSlashIcon className="h-6 w-6" />
                  ) : (
                    <EyeIcon className="h-6 w-6" />
                  )}
                </button>
                {!isNew && (
                  <button
                    onClick={() => copyPassword()}
                    className="text-gray-400 hover:text-brand-3 active:text-primary"
                    title="Copy password"
                  >
                    <DocumentDuplicateIcon className="h-6 w-6" />
                  </button>
                )}
              </div>
            }
          />

          <label className="block text-sm font-semibold leading-6 text-gray-900">
            URIs
          </label>
          {editableItem?.login?.[ItemKeys.URI].map((uri, index) => {
            return (
              <Input
                value={editableItem?.login?.[ItemKeys.URI][index]!}
                onChange={(e) =>
                  onChangeFormInput({
                    key: ItemKeys.URI,
                    value: e.target.value,
                    isLogin: true,
                    uriIndex: index,
                  })
                }
                placeholder={`URI #${index + 1}`}
                disabled={mode === Mode.VIEW}
                after={
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <button
                      onClick={() => deleteUri(index)}
                      className="text-gray-400 hover:text-brand-3 active:text-primary"
                      title="Delete URI"
                    >
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </div>
                }
              />
            );
          })}

          <Button onClick={() => addUriRow()}>Add more URI</Button>
        </>
      )}

      <div className="mt-20 grid grid-cols-6 gap-2">
        {mode == Mode.VIEW ? (
          <>
            <Button
              disabled={ndk === undefined}
              onClick={() => setMode(Mode.EDIT)}
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
                onClick={() => setMode(Mode.VIEW)}
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
