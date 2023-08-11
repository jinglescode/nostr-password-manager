import { Fragment, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { viewStore } from "../../stores/view";

let timeout: NodeJS.Timeout;
const clearTimeoutDuration = 5 * 1000;

export default function Notification() {
  const appNotification = viewStore((state) => state.appNotification);
  const setAppNotification = viewStore((state) => state.setAppNotification);

  useEffect(() => {
    if (appNotification) {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (["success", "error"].includes(appNotification.type)) {
        timeout = setTimeout(() => {
          setAppNotification(undefined);
        }, clearTimeoutDuration);
      }
    }
  }, [appNotification]);

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={appNotification !== undefined}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* <>
            {appNotification && ( */}
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {appNotification?.type === "success" && (
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-400"
                      aria-hidden="true"
                    />
                  )}
                  {appNotification?.type === "error" && (
                    <XMarkIcon
                      className="h-6 w-6 text-red-400"
                      aria-hidden="true"
                    />
                  )}
                  {appNotification?.type === "confirm" && (
                    <QuestionMarkCircleIcon
                      className="h-6 w-6 text-yellow-400"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-brand-black">
                    {appNotification?.title}
                  </p>
                  {appNotification?.message && (
                    <p className="mt-1 text-sm text-brand-gray-light">
                      {appNotification?.message}
                    </p>
                  )}

                  {appNotification?.type === "confirm" && (
                    <div className="mt-4 flex">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-brand-2 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary"
                        onClick={() => {
                          setAppNotification(undefined);
                          if (appNotification?.onConfirm)
                            appNotification?.onConfirm();
                        }}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className="ml-3 inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-brand-black shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => {
                          setAppNotification(undefined);
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-white text-brand-gray-light hover:text-brand-gray-light focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      setAppNotification(undefined);
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* )}
          </> */}
        </Transition>
      </div>
    </div>
  );
}
