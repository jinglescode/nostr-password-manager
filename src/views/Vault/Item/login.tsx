import {
  InformationCircleIcon,
  KeyIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Item } from "../../../types/item";
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

  function viewItem() {
    setItemDetails(item);
    setView(Views.ITEM);
  }

  if (item.login === undefined) return <></>;

  return (
    <div className="whitespace-nowrap text-sm py-2 overflow-x-hidden">
      <div className="flex items-center mx-4">
        <div className="flex-grow overflow-x-hidden">
          <p className="font-medium text-gray-900 text-ellipsis overflow-x-hidden">
            {item[ItemKeys.NAME]}
          </p>
          <p className="text-gray-500 text-ellipsis overflow-x-hidden">
            {item.login[ItemKeys.USERNAME]}
          </p>
        </div>
        <div className="flex-none text-gray-500 flex items-center">
          <button
            onClick={() => viewItem()}
            className="text-gray-400 hover:text-brand-3 active:text-primary"
            title="View item"
          >
            <InformationCircleIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => {
              copyUser();
              setAppNotification({
                title: "Username copied to clipboard",
                type: "success",
              });
            }}
            className="text-gray-400 hover:text-brand-3 active:text-primary"
            title="Copy username"
          >
            <UserIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => {
              copyPassword();
              setAppNotification({
                title: "Password copied to clipboard",
                type: "success",
              });
            }}
            className="text-gray-400 hover:text-brand-3 active:text-primary"
            title="Copy password"
          >
            <KeyIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
