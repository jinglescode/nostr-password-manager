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
    <div className="whitespace-nowrap text-sm overflow-x-hidden">
      <div className="flex items-center mx-4 h-14 py-2">
        <div className="flex-grow overflow-x-hidden">
          <p className="font-medium text-brand-black text-ellipsis overflow-x-hidden">
            {item[ItemKeys.NAME]}
          </p>
        </div>
        <div className="flex-none text-brand-gray-light flex items-center">
          <button
            onClick={() => {
              copyNote();
              setAppNotification({
                title: chrome.i18n.getMessage("notification_note_copied"),
                type: "success",
              });
            }}
            className="text-brand-gray-light hover:text-primary"
            title={chrome.i18n.getMessage("button_copy_note")}
          >
            <DocumentDuplicateIcon className="h-6 w-6" />
          </button>
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
