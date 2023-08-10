import Textarea from "../../components/Textarea";
import { EditItemViews, ItemKeys } from "../../enums/item";
import { Item } from "../../types/item";

export default function NoteItem({
  editableItem,
  onChangeFormInput,
  mode,
}: {
  editableItem: Item;
  onChangeFormInput: Function;
  mode: EditItemViews;
}) {
  return (
    <>
      <Textarea
        label="Your note"
        value={editableItem?.note?.[ItemKeys.TEXT] || ""}
        onChange={(e) =>
          onChangeFormInput({
            key: ItemKeys.TEXT,
            value: e.target.value,
            isNote: true,
          })
        }
        placeholder="need something remembered?"
        name="note"
        rows={6}
        disabled={mode === EditItemViews.VIEW}
      />
    </>
  );
}
