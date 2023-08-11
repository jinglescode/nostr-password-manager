import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import { FAQS } from "../../constants/faqs";
import { useEffect } from "react";

export default function FAQView() {

  return (
    <div className="w-full h-full">
      <dl className="mx-4 space-y-2 divide-y divide-gray-900/10 pb-2">
        {FAQS.map((faq) => (
          <Disclosure as="div" key={faq.question} className="pt-2">
            {({ open }) => (
              <>
                <dt>
                  <Disclosure.Button className="flex w-full items-start justify-between text-left">
                    <span className="text-base font-semibold leading-7 text-brand-black">
                      {faq.question}
                    </span>
                    <span className="ml-6 flex h-7 items-center text-brand-gray">
                      {open ? (
                        <MinusSmallIcon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                      )}
                    </span>
                  </Disclosure.Button>
                </dt>
                <Disclosure.Panel as="dd" className="mt-2 pr-12">
                  <p className="text-brand-gray text-sm">{faq.answer}</p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </dl>
    </div>
  );
}
