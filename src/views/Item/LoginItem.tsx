import { useState } from "react";
import { EditItemViews, ItemKeys } from "../../enums/item";
import { Item } from "../../types/item";
import { useClipboard } from "../../hooks/useCopyClipboard";
import Input from "../../components/Input";
import {
  ArrowPathIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import Button from "../../components/Button";
import { viewStore } from "../../stores/view";
import { generatePassword } from "../../utils/strings/passwordGenerator";

export default function LoginItem({
  editableItem,
  onChangeFormInput,
  mode,
  isNew,
  setEditableItem,
}: {
  editableItem: Item;
  onChangeFormInput: Function;
  mode: EditItemViews;
  isNew: boolean;
  setEditableItem: Function;
}) {
  const setAppNotification = viewStore((state) => state.setAppNotification);

  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const { onCopy: copyUser } = useClipboard(
    editableItem?.login?.[ItemKeys.USERNAME] || ""
  );
  const { onCopy: copyPassword } = useClipboard(
    editableItem?.login?.[ItemKeys.PASSWORD] || ""
  );

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

  async function generateNewPassword() {
    const password = await generatePassword();
    onChangeFormInput({
      key: ItemKeys.PASSWORD,
      value: password,
      isLogin: true,
    });
  }

  return (
    <>
      <Input
        label={chrome.i18n.getMessage("form_username")}
        name="username"
        placeholder={chrome.i18n.getMessage("form_username_placeholder")}
        value={editableItem?.login?.[ItemKeys.USERNAME] || ""}
        onChange={(e) =>
          onChangeFormInput({
            key: ItemKeys.USERNAME,
            value: e.target.value,
            isLogin: true,
          })
        }
        disabled={mode === EditItemViews.VIEW}
        after={
          !isNew && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <button
                onClick={() => {
                  copyUser();
                  setAppNotification({
                    title: chrome.i18n.getMessage(
                      "notification_username_copied"
                    ),
                    type: "success",
                  });
                }}
                className="text-brand-gray-light hover:text-primary"
                title={chrome.i18n.getMessage("notification_copy_username")}
              >
                <DocumentDuplicateIcon className="h-6 w-6" />
              </button>
            </div>
          )
        }
      />
      <Input
        label={chrome.i18n.getMessage("form_password")}
        name="password"
        type={isShowPassword ? "text" : "password"}
        placeholder={chrome.i18n.getMessage("form_password_placeholder")}
        value={editableItem?.login?.[ItemKeys.PASSWORD] || ""}
        onChange={(e) =>
          onChangeFormInput({
            key: ItemKeys.PASSWORD,
            value: e.target.value,
            isLogin: true,
          })
        }
        disabled={mode === EditItemViews.VIEW}
        after={
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {mode == EditItemViews.EDIT && (
              <button
                onClick={() => generateNewPassword()}
                className="text-brand-gray-light hover:text-primary"
                title={chrome.i18n.getMessage("button_generate_password")}
              >
                <ArrowPathIcon className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={() => setIsShowPassword(!isShowPassword)}
              className="text-brand-gray-light hover:text-primary"
              title={
                isShowPassword
                  ? chrome.i18n.getMessage("button_hide_password")
                  : chrome.i18n.getMessage("button_show_password")
              }
            >
              {isShowPassword ? (
                <EyeSlashIcon className="h-6 w-6" />
              ) : (
                <EyeIcon className="h-6 w-6" />
              )}
            </button>
            {!isNew && (
              <button
                onClick={() => {
                  copyPassword();
                  setAppNotification({
                    title: chrome.i18n.getMessage(
                      "notification_password_copied"
                    ),
                    type: "success",
                  });
                }}
                className="text-brand-gray-light hover:text-primary"
                title={chrome.i18n.getMessage("notification_copy_password")}
              >
                <DocumentDuplicateIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        }
      />

      <div className="flex justify-between">
        <label className="block text-sm font-semibold leading-6 text-brand-black">
          {chrome.i18n.getMessage("form_uris")}
        </label>
        <span
          className="text-sm leading-6 text-gray-500"
          title={chrome.i18n.getMessage("form_uris_tip")}
        >
          <QuestionMarkCircleIcon className="h-4 w-4 inline-block text-brand-gray" />
        </span>
      </div>
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
            disabled={mode === EditItemViews.VIEW}
            after={
              <>
                {mode == EditItemViews.EDIT && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <button
                      onClick={() => deleteUri(index)}
                      className="text-brand-gray-light hover:text-primary"
                      title={chrome.i18n.getMessage("button_delete_uri")}
                    >
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </div>
                )}
              </>
            }
          />
        );
      })}
      {mode == EditItemViews.EDIT && (
        <Button onClick={() => addUriRow()}>
          {chrome.i18n.getMessage("button_add_uri")}
        </Button>
      )}
    </>
  );
}
