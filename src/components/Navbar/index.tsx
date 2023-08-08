import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Views, viewStore } from "../../stores/view";
import { accountStore } from "../../stores/account";
import { AccountStates } from "../../enums/account";
import { searchStore } from "../../stores/search";

export default function Navbar() {
  const showMenu = viewStore((state) => state.showMenu);
  const toggleShowMenu = viewStore((state) => state.toggleShowMenu);
  const state = accountStore((state) => state.state);
  const searchInput = searchStore((state) => state.searchInput);
  const setSearchInput = searchStore((state) => state.setSearchInput);

  const view = viewStore((state) => state.view);
  const setView = viewStore((state) => state.setView);

  return (
    <div className="bg-brand-4">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center px-2 lg:px-0">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src={chrome.runtime.getURL("/images/rounded-512.png")}
              />
            </div>
          </div>

          <div className="flex flex-1 justify-center px-2">
            <div className="w-full max-w-lg">
              {state == AccountStates.LOGGED_IN && view === Views.VAULT && (
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full rounded-md border-0 bg-brand-3 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none"
                    placeholder="Search vault"
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
              )}
              {view === Views.ITEM && (
                <div className="text-white text-center text-lg">Item</div>
              )}
              {view === Views.ROADMAP && (
                <div className="text-white text-center text-lg">Roadmap</div>
              )}
              {view === Views.FAQ && (
                <div className="text-white text-center text-lg">FAQs</div>
              )}
              {view === Views.DONATE && (
                <div className="text-white text-center text-lg">Donate</div>
              )}
            </div>
          </div>

          <div className="flex">
            {view === Views.ITEM ? (
              <button
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-brand-2 hover:text-white"
                onClick={() => setView(Views.VAULT)}
              >
                <XMarkIcon className="block h-6 w-6" />
              </button>
            ) : (
              <button
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-brand-2 hover:text-white"
                onClick={() => toggleShowMenu()}
              >
                {showMenu ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
