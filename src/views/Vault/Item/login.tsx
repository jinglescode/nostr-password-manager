import {
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon,
  KeyIcon,
  SparklesIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import type { Item } from "../../../types/item";
import { ItemKeys } from "../../../enums/item";
import { useClipboard } from "../../../hooks/useCopyClipboard";
import { Views, viewStore } from "../../../stores/view";

export default function LoginItem({ item }: { item: Item }) {
  const setView = viewStore((state) => state.setView);
  const setItemDetails = viewStore((state) => state.setItemDetails);
  const setAppNotification = viewStore((state) => state.setAppNotification);

  const { onCopy: copyUser } = useClipboard(
    item.login?.[ItemKeys.USERNAME] || ""
  );
  const { onCopy: copyPassword } = useClipboard(
    item.login?.[ItemKeys.PASSWORD] || ""
  );

  const hasUri =
    (item.login &&
      item.login[ItemKeys.URI] &&
      item.login[ItemKeys.URI].length > 0) ||
    false;

  function viewItem() {
    setItemDetails(item);
    setView(Views.ITEM);
  }

  function openSite() {
    if (hasUri) {
      window.open(item.login?.[ItemKeys.URI][0], "_blank");
    }
  }

  async function fillForms() {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tab && tab.id) {
      await chrome.tabs.sendMessage(
        tab.id,
        {
          type: "FILLFORM",
          payload: {
            username: item.login?.[ItemKeys.USERNAME],
            password: item.login?.[ItemKeys.PASSWORD],
          },
        },
        (response) => {}
      );
    }
  }

  if (item.login === undefined) return <></>;

  return (
    <div className="whitespace-nowrap text-sm overflow-x-hidden">
      <div className="flex items-center mx-4 h-14 py-2">
        <div className="flex-grow overflow-x-hidden">
          <p className="font-medium text-brand-black text-ellipsis overflow-x-hidden">
            {item[ItemKeys.NAME]}
          </p>
          <p className="text-brand-gray text-ellipsis overflow-x-hidden">
            {item.login[ItemKeys.USERNAME]}
          </p>
        </div>
        <div className="flex-none flex items-center">
          <button
            onClick={() => fillForms()}
            className="text-brand-gray-light hover:text-primary"
            title={chrome.i18n.getMessage("button_fill_forms")}
          >
            <SparklesIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => {
              copyUser();
              setAppNotification({
                title: chrome.i18n.getMessage("notification_username_copied"),
                type: "success",
              });
            }}
            className="text-brand-gray-light hover:text-primary"
            title={chrome.i18n.getMessage("notification_copy_username")}
          >
            <UserIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => {
              copyPassword();
              setAppNotification({
                title: chrome.i18n.getMessage("notification_password_copied"),
                type: "success",
              });
            }}
            className="text-brand-gray-light hover:text-primary"
            title={chrome.i18n.getMessage("notification_copy_password")}
          >
            <KeyIcon className="h-6 w-6" />
          </button>
          {hasUri && (
            <button
              onClick={() => openSite()}
              className="text-brand-gray-light hover:text-primary"
              title={chrome.i18n.getMessage("button_open_site")}
            >
              <ArrowTopRightOnSquareIcon className="h-6 w-6" />
            </button>
          )}
          <button
            onClick={() => viewItem()}
            className="text-brand-gray-light hover:text-primary"
            title={chrome.i18n.getMessage("button_view_item")}
          >
            <InformationCircleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
