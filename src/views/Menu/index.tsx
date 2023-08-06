import {
  GiftIcon,
  InformationCircleIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { Views, viewStore } from "../../stores/view";

export default function MenuView() {
  const setView = viewStore((state) => state.setView);

  return (
    <div className="bg-brand-4 rounded-b-lg pb-4 px-4">
      <div className="grid grid-cols-4 gap-4">
        <MenuItem icon={<PlusIcon className="h-6 w-6" />} text="Add" />

        <MenuItem icon={<GiftIcon className="h-6 w-6" />} text="Donate" />
        <MenuItem
          icon={<InformationCircleIcon className="h-6 w-6" />}
          text="About"
        />
      </div>
    </div>
  );
}

function MenuItem({ icon, text, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-brand-2 hover:text-white"
    >
      <div className="flex flex-col items-center">
        {icon}
        <span className="text-xs">{text}</span>
      </div>
    </button>
  );
}
