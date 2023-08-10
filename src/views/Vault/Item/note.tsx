import {
  InformationCircleIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/20/solid";
import { Item } from "../../../types/item";
import { ItemKeys } from "../../../enums/item";
import { useClipboard } from "../../../hooks/useCopyClipboard";
import { Views, viewStore } from "../../../stores/view";

export default function NoteItem({ item }: { item: Item }) {
  const setView = viewStore((state) => state.setView);
  const setItemDetails = viewStore((state) => state.setItemDetails);
  const setAppNotification = viewStore((state) => state.setAppNotification);

  const { onCopy: copyNote } = useClipboard(item.note?.[ItemKeys.TEXT] || "");

  function viewItem() {
    setItemDetails(item);
    setView(Views.ITEM);
  }

  if (item.note === undefined) return <></>;

  return (
    <div className="whitespace-nowrap text-sm py-2 overflow-x-hidden">
      <div className="flex items-center mx-4">
        <div className="flex-grow overflow-x-hidden">
          <p className="font-medium text-gray-900 text-ellipsis overflow-x-hidden">
            {item[ItemKeys.NAME]}
          </p>
        </div>
        <div className="flex-none text-gray-500 flex items-center">
          <button
            onClick={() => {
              copyNote();
              setAppNotification({
                title: "Note copied to clipboard",
                type: "success",
              });
            }}
            className="text-gray-400 hover:text-brand-3 active:text-primary"
            title="Copy note"
          >
            <DocumentDuplicateIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => viewItem()}
            className="text-gray-400 hover:text-brand-3 active:text-primary"
            title="View item"
          >
            <InformationCircleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
