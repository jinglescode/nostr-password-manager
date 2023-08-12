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
    label: chrome.i18n.getMessage("nav_login"),
    desc: chrome.i18n.getMessage("info_login"),
    key: ItemType.LOGIN,
  },
  [ItemType.NOTE]: {
    label: chrome.i18n.getMessage("nav_note"),
    desc: chrome.i18n.getMessage("info_note"),
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
          <Listbox.Label className="block text-sm font-medium leading-6 text-brand-black">
            {chrome.i18n.getMessage("form_item_type")}
          </Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="block w-full rounded-md border-0 px-3.5 py-2 text-brand-black shadow-sm ring-1 ring-inset placeholder:text-brand-gray-light sm:text-sm sm:leading-6 ring-brand-2 focus:ring-primary">
              <span className="inline-flex w-full truncate">
                <span className="truncate">{itemTypes[itemType].label}</span>
                <span className="ml-2 truncate text-brand-gray">
                  {itemTypes[itemType].desc}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-brand-gray-light"
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
                      return `relative select-none py-2 pl-3 pr-9 ${
                        active ? "bg-brand-2 text-white" : "text-brand-black"
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
                              active ? "text-white" : "text-brand-gray"
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
