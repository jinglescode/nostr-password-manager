import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
          {state == AccountStates.LOGGED_IN && (
            <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="w-full max-w-lg lg:max-w-xs">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
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
              </div>
            </div>
          )}

          <div className="flex">
            <button
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
              onClick={() => toggleShowMenu()}
            >
              {showMenu ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <Disclosure as="nav" className="bg-gray-800">
  //     {({ open }) => (
  //       <>
  //         <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
  //           <div className="relative flex h-16 items-center justify-between">
  //             <div className="flex items-center px-2 lg:px-0">
  //               <div className="flex-shrink-0">
  //                 <img
  //                   className="h-8 w-auto"
  //                   src={chrome.runtime.getURL("/images/rounded-512.png")}
  //                 />
  //               </div>
  //               <div className="hidden lg:ml-6 lg:block">
  //                 <div className="flex space-x-4">
  //                   {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
  //                   <a
  //                     href="#"
  //                     className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
  //                   >
  //                     Dashboard
  //                   </a>
  //                   <a
  //                     href="#"
  //                     className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
  //                   >
  //                     Team
  //                   </a>
  //                   <a
  //                     href="#"
  //                     className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
  //                   >
  //                     Projects
  //                   </a>
  //                   <a
  //                     href="#"
  //                     className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
  //                   >
  //                     Calendar
  //                   </a>
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
  //               <div className="w-full max-w-lg lg:max-w-xs">
  //                 <div className="relative">
  //                   <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
  //                     <MagnifyingGlassIcon
  //                       className="h-5 w-5 text-gray-400"
  //                       aria-hidden="true"
  //                     />
  //                   </div>
  //                   <input
  //                     id="search"
  //                     name="search"
  //                     className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none"
  //                     placeholder="Search vault"
  //                     type="search"
  //                   />
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="flex lg:hidden">
  //               {/* Mobile menu button */}
  //               <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
  //                 <span className="absolute -inset-0.5" />
  //                 <span className="sr-only">Open main menu</span>
  //                 {open ? (
  //                   <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
  //                 ) : (
  //                   <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
  //                 )}
  //               </Disclosure.Button>
  //             </div>
  //             <div className="hidden lg:ml-4 lg:block">
  //               <div className="flex items-center">
  //                 <button
  //                   type="button"
  //                   className="relative flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white"
  //                 >
  //                   <span className="absolute -inset-1.5" />
  //                   <span className="sr-only">View notifications</span>
  //                   <BellIcon className="h-6 w-6" aria-hidden="true" />
  //                 </button>

  //                 {/* Profile dropdown */}
  //                 <Menu as="div" className="relative ml-4 flex-shrink-0">
  //                   <div>
  //                     <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm text-white">
  //                       <span className="absolute -inset-1.5" />
  //                       <span className="sr-only">Open user menu</span>
  //                       <img
  //                         className="h-8 w-8 rounded-full"
  //                         src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  //                         alt=""
  //                       />
  //                     </Menu.Button>
  //                   </div>
  //                   <Transition
  //                     as={Fragment}
  //                     enter="transition ease-out duration-100"
  //                     enterFrom="transform opacity-0 scale-95"
  //                     enterTo="transform opacity-100 scale-100"
  //                     leave="transition ease-in duration-75"
  //                     leaveFrom="transform opacity-100 scale-100"
  //                     leaveTo="transform opacity-0 scale-95"
  //                   >
  //                     <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
  //                       <Menu.Item>
  //                         {({ active }) => (
  //                           <a
  //                             href="#"
  //                             className={`block px-4 py-2 text-sm text-gray-700 ${
  //                               active && "bg-gray-100"
  //                             }`}
  //                           >
  //                             Your Profile
  //                           </a>
  //                         )}
  //                       </Menu.Item>
  //                       <Menu.Item>
  //                         {({ active }) => (
  //                           <a
  //                             href="#"
  //                             className={`block px-4 py-2 text-sm text-gray-700 ${
  //                               active && "bg-gray-100"
  //                             }`}
  //                           >
  //                             Settings
  //                           </a>
  //                         )}
  //                       </Menu.Item>
  //                       <Menu.Item>
  //                         {({ active }) => (
  //                           <a
  //                             href="#"
  //                             className={`block px-4 py-2 text-sm text-gray-700 ${
  //                               active && "bg-gray-100"
  //                             }`}
  //                           >
  //                             Sign out
  //                           </a>
  //                         )}
  //                       </Menu.Item>
  //                     </Menu.Items>
  //                   </Transition>
  //                 </Menu>
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         <Disclosure.Panel className="lg:hidden">
  //           <div className="space-y-1 px-2 pb-3 pt-2">
  //             {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
  //             <Disclosure.Button
  //               as="a"
  //               href="#"
  //               className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
  //             >
  //               Dashboard
  //             </Disclosure.Button>
  //             <Disclosure.Button
  //               as="a"
  //               href="#"
  //               className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
  //             >
  //               Team
  //             </Disclosure.Button>
  //             <Disclosure.Button
  //               as="a"
  //               href="#"
  //               className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
  //             >
  //               Projects
  //             </Disclosure.Button>
  //             <Disclosure.Button
  //               as="a"
  //               href="#"
  //               className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
  //             >
  //               Calendar
  //             </Disclosure.Button>
  //           </div>
  //           <div className="border-t border-gray-700 pb-3 pt-4">
  //             <div className="flex items-center px-5">
  //               <div className="flex-shrink-0">
  //                 <img
  //                   className="h-10 w-10 rounded-full"
  //                   src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  //                   alt=""
  //                 />
  //               </div>
  //               <div className="ml-3">
  //                 <div className="text-base font-medium text-white">
  //                   Tom Cook
  //                 </div>
  //                 <div className="text-sm font-medium text-gray-400">
  //                   tom@example.com
  //                 </div>
  //               </div>
  //               <button
  //                 type="button"
  //                 className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white"
  //               >
  //                 <span className="absolute -inset-1.5" />
  //                 <span className="sr-only">View notifications</span>
  //                 <BellIcon className="h-6 w-6" aria-hidden="true" />
  //               </button>
  //             </div>
  //             <div className="mt-3 space-y-1 px-2">
  //               <Disclosure.Button
  //                 as="a"
  //                 href="#"
  //                 className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
  //               >
  //                 Your Profile
  //               </Disclosure.Button>
  //               <Disclosure.Button
  //                 as="a"
  //                 href="#"
  //                 className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
  //               >
  //                 Settings
  //               </Disclosure.Button>
  //               <Disclosure.Button
  //                 as="a"
  //                 href="#"
  //                 className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
  //               >
  //                 Sign out
  //               </Disclosure.Button>
  //             </div>
  //           </div>
  //         </Disclosure.Panel>
  //       </>
  //     )}
  //   </Disclosure>
  // );
}
