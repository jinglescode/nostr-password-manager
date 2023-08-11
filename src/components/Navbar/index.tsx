import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Views, viewStore } from "../../stores/view";
import { accountStore } from "../../stores/account";
import { AccountStates } from "../../enums/account";
import { searchStore } from "../../stores/search";
import { ItemKeys, ItemType } from "../../enums/item";

export default function Navbar() {
  const showMenu = viewStore((state) => state.showMenu);
  const toggleShowMenu = viewStore((state) => state.toggleShowMenu);
  const state = accountStore((state) => state.state);
  const searchInput = searchStore((state) => state.searchInput);
  const setSearchInput = searchStore((state) => state.setSearchInput);

  const view = viewStore((state) => state.view);
  const setView = viewStore((state) => state.setView);
  const itemDetails = viewStore((state) => state.itemDetails);

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
              {!showMenu ? (
                <>
                  {state == AccountStates.LOGGED_IN && view === Views.VAULT && (
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-brand-gray-light" />
                      </div>
                      <input
                        className="block w-full rounded-md border-0 bg-brand-3 py-1.5 pl-10 pr-3 text-brand-gray-light placeholder:text-brand-gray-light sm:text-sm sm:leading-6 focus:outline-none"
                        placeholder={chrome.i18n.getMessage("nav_search_vault")}
                        type="search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </div>
                  )}
                  {view === Views.ITEM && (
                    <div className="text-white text-center text-lg">
                      {itemDetails ? (
                        <>
                          {itemDetails[ItemKeys.TYPE] == ItemType.LOGIN &&
                            chrome.i18n.getMessage("nav_login")}
                          {itemDetails[ItemKeys.TYPE] == ItemType.NOTE &&
                            chrome.i18n.getMessage("nav_note")}
                        </>
                      ) : (
                        chrome.i18n.getMessage("nav_new_item")
                      )}
                    </div>
                  )}
                  {view === Views.ROADMAP && (
                    <div className="text-white text-center text-lg">
                      {chrome.i18n.getMessage("nav_roadmap")}
                    </div>
                  )}
                  {view === Views.FAQ && (
                    <div className="text-white text-center text-lg">
                      {chrome.i18n.getMessage("nav_faqs")}
                    </div>
                  )}
                  {view === Views.SUPPORT && (
                    <div className="text-white text-center text-lg">
                      {chrome.i18n.getMessage("nav_support")}
                    </div>
                  )}
                  {view === Views.SETTINGS && (
                    <div className="text-white text-center text-lg">
                      {chrome.i18n.getMessage("nav_settings")}
                    </div>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="flex">
            {view === Views.ITEM ? (
              <button
                className="relative inline-flex items-center justify-center rounded-md p-2 text-brand-gray-light hover:text-primary"
                onClick={() => setView(Views.VAULT)}
              >
                <XMarkIcon className="block h-6 w-6" />
              </button>
            ) : (
              <button
                className="relative inline-flex items-center justify-center rounded-md p-2 text-brand-gray-light hover:text-primary"
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
