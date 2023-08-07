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
  const [inputName, setinputName] = useState<string>(
    itemDetails?.[ItemKeys.NAME] || ""
  );

  let _itemDetails = itemDetails;
  useEffect(() => {
    if (itemDetails === undefined) {
      setIsNew(true);
      setMode(Mode.EDIT);
      _itemDetails = {
        id: makeId(),
        [ItemKeys.TYPE]: ItemType.LOGIN,
        [ItemKeys.NAME]: "",
        login: {
          [ItemKeys.USERNAME]: "",
          [ItemKeys.PASSWORD]: "",
          [ItemKeys.URI]: [],
        },
      };
    }
  }, [itemDetails]);
  console.log(44, "isNew", isNew, itemDetails);

  // login
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const { onCopy: copyUser } = useClipboard(
    _itemDetails?.login?.[ItemKeys.USERNAME] || ""
  );
  const { onCopy: copyPassword } = useClipboard(
    _itemDetails?.login?.[ItemKeys.PASSWORD] || ""
  );

  const [inputUsername, setinputUsername] = useState<string>(
    _itemDetails?.login?.[ItemKeys.USERNAME] || ""
  );
  const [inputPassword, setinputPassword] = useState<string>(
    _itemDetails?.login?.[ItemKeys.PASSWORD] || ""
  );

  function generatePassword() {}

  function validate() {
    return true;
  }

  async function save() {
    if (data === undefined) return;
    if (_itemDetails === undefined) return;
    if (!validate) return;

    // 1. get list

    // 1a. if no list, create a new list
    let list: List = data[0];
    if (data.length === 0) {
      list = {
        id: "main",
        mod: 0,
        items: {},
      };
    }

    // 1b. if has 1 list, use that list
    // if (data.length === 1) {
    //   list = data[0];
    // }
    // 1c. if has more than 1 list, get from selected list, todo future

    // 2. update item to list

    // 2a. if new item, just append to list

    const item: Item = {
      id: _itemDetails.id!,
      [ItemKeys.TYPE]: ItemType.LOGIN,
      [ItemKeys.NAME]: inputName,
      login: {
        [ItemKeys.USERNAME]: inputUsername,
        [ItemKeys.PASSWORD]: inputPassword,
        [ItemKeys.URI]: [],
      },
    };

    if (isNew) {
      list.items[makeId()] = item;
    }

    // 2b. if existing item, update item in list
    else {
      list.items[_itemDetails.id] = item;
    }

    console.log(5, "saving item", item, list);
    // setView(Views.VAULT);
  }

  async function deleteItem() {}

  return (
    <div className="w-full p-2 space-y-2">
      <Input
        label="Name"
        name="name"
        placeholder="something to identify this item"
        value={inputName}
        onChange={(e) => setinputName(e.target.value)}
        disabled={mode === Mode.VIEW}
      />
      {_itemDetails?.[ItemKeys.TYPE] === ItemType.LOGIN && (
        <>
          <Input
            label="Username"
            name="username"
            placeholder="login username"
            value={inputUsername}
            onChange={(e) => setinputUsername(e.target.value)}
            disabled={mode === Mode.VIEW}
            after={
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <button
                  onClick={() => copyUser()}
                  className="text-gray-400 hover:text-brand-3 active:text-primary"
                  title="Copy username"
                >
                  <DocumentDuplicateIcon className="h-6 w-6" />
                </button>
              </div>
            }
          />
          <Input
            label="Password"
            name="password"
            type={isShowPassword ? "text" : "password"}
            placeholder="login password"
            value={inputPassword}
            onChange={(e) => setinputPassword(e.target.value)}
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
