import {
  GiftIcon,
  InformationCircleIcon,
  ListBulletIcon,
  PlusIcon,
  RectangleStackIcon,
  RocketLaunchIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/20/solid";
import { Views, viewStore } from "../../stores/view";
import { accountStore } from "../../stores/account";
import { AccountStates } from "../../enums/account";

export default function MenuView() {
  const setView = viewStore((state) => state.setView);
  const toggleShowMenu = viewStore((state) => state.toggleShowMenu);
  const setItemDetails = viewStore((state) => state.setItemDetails);
  const state = accountStore((state) => state.state);

  function goToView(view: Views) {
    if (view === Views.ITEM) {
      setItemDetails(undefined);
    }

    setView(view);
    toggleShowMenu();
  }

  return (
    <div className="bg-brand-4 rounded-b-lg pb-4 px-4">
      <div className="grid grid-cols-4 gap-4">
        <MenuItem
          icon={<PlusIcon className="h-6 w-6" />}
          text="Add"
          onClick={() => {
            if (state === AccountStates.LOGGED_IN) {
              goToView(Views.ITEM);
            } else {
              goToView(Views.LOGIN);
            }
          }}
        />
        <MenuItem
          icon={<RectangleStackIcon className="h-6 w-6" />}
          text="Vault"
          onClick={() => {
            if (state === AccountStates.LOGGED_IN) {
              goToView(Views.VAULT);
            } else {
              goToView(Views.LOGIN);
            }
          }}
        />
        <MenuItem
          icon={<RocketLaunchIcon className="h-6 w-6" />}
          text="Roadmap"
          onClick={() => goToView(Views.ROADMAP)}
        />
        <MenuItem
          icon={<ListBulletIcon className="h-6 w-6" />}
          text="FAQ"
          onClick={() => goToView(Views.FAQ)}
        />
        <MenuItem
          icon={<WrenchScrewdriverIcon className="h-6 w-6" />}
          text="Settings"
          onClick={() => goToView(Views.SETTINGS)}
        />
        <MenuItem
          icon={<GiftIcon className="h-6 w-6" />}
          text="Donate"
          onClick={() => window.open(`https://getalby.com/p/vault`)}
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
