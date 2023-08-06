import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { viewStore } from "../../stores/view";
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

enum Mode {
  EDIT,
  VIEW,
}

export default function ItemView() {
  const { ndk } = useNDK();
  const setView = viewStore((state) => state.setView);
  const itemDetails = viewStore((state) => state.itemDetails);

  const [mode, setMode] = useState<Mode>(Mode.VIEW);
  const [inputName, setinputName] = useState<string>(
    itemDetails?.[ItemKeys.NAME] || ""
  );

  // login
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const { onCopy: copyUser } = useClipboard(
    itemDetails?.login?.[ItemKeys.USERNAME] || ""
  );
  const { onCopy: copyPassword } = useClipboard(
    itemDetails?.login?.[ItemKeys.PASSWORD] || ""
  );

  const [inputUsername, setinputUsername] = useState<string>(
    itemDetails?.login?.[ItemKeys.USERNAME] || ""
  );
  const [inputPassword, setinputPassword] = useState<string>(
    itemDetails?.login?.[ItemKeys.PASSWORD] || ""
  );

  function generatePassword() {}

  function validate() {
    return true;
  }

  async function save() {}

  async function deleteItem() {}

  return (
    <div className="w-full px-2 space-y-2">
      <Input
        label="Name"
        name="name"
        placeholder="something to identify this item"
        value={inputName}
        onChange={(e) => setinputName(e.target.value)}
        disabled={mode === Mode.VIEW}
      />
      {itemDetails?.[ItemKeys.TYPE] === ItemType.LOGIN && itemDetails.login && (
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
                <button
                  onClick={() => copyPassword()}
                  className="text-gray-400 hover:text-brand-3 active:text-primary"
                  title="Copy password"
                >
                  <DocumentDuplicateIcon className="h-6 w-6" />
                </button>
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
            <Button
              onClick={() => setMode(Mode.VIEW)}
              title="Lock to exit editing mode"
            >
              <div className="flex flex-col items-center">
                <LockOpenIcon className="h-4 w-4" />
                <span className="text-xs">Lock</span>
              </div>
            </Button>
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
          </>
        )}
      </div>
    </div>
  );
}
