import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { ItemKeys, ItemType } from "../../enums/item";

const itemTypes: {
  [id: string]: {
    label: string;
    desc: string;
    key: ItemType;
  };
} = {
  [ItemType.LOGIN]: {
    label: "Login",
    desc: "username and password",
    key: ItemType.LOGIN,
  },
  [ItemType.NOTE]: {
    label: "Note",
    desc: "short notes about anything",
    key: ItemType.NOTE,
  },
};

export default function SelectItemType({
  itemType,
  setEditableItem,
}: {
  itemType: ItemType;
  setEditableItem: Function;
}) {
  function setSelected(value: ItemType) {
    setEditableItem((prev: any) => ({ ...prev, [ItemKeys.TYPE]: value }));
  }

  return (
    <Listbox value={itemType} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
            Item Type
          </Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button 
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 sm:text-sm sm:leading-6 ring-brand-2 focus:ring-primary"
            // className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
            >
              <span className="inline-flex w-full truncate">
                <span className="truncate">{itemTypes[itemType].label}</span>
                <span className="ml-2 truncate text-gray-500">
                  {itemTypes[itemType].desc}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {Object.keys(itemTypes).map((item, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) => {
                      return `relative cursor-default select-none py-2 pl-3 pr-9 ${
                        active ? "bg-brand-2 text-white" : "text-gray-900"
                      }`;
                    }}
                    value={itemTypes[item].key}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex">
                          <span
                            className={`truncate ${
                              selected ? "font-semibold" : "font-normal"
                            }`}
                          >
                            {itemTypes[item].label}
                          </span>
                          <span
                            className={`ml-2 truncate ${
                              active ? "text-white" : "text-gray-500"
                            }`}
                          >
                            {itemTypes[item].desc}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                              active ? "text-white" : "text-brand-2"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
