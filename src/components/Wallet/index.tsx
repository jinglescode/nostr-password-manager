import { Dialog, Transition } from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/24/outline"
import {
  getEventHash,
  getPublicKey,
  getSignature,
  nip19,
  validateEvent
} from "nostr-tools"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger
// } from "~/components/ui/dialog"
import { Fragment, useEffect, useRef, useState } from "react"

import { sendToBackground, sendToBackgroundViaRelay } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { SecureStorage } from "@plasmohq/storage/secure"

import { StorageKeys } from "~enums/storage"
import { getSessionStorage } from "~utils/chrome/storage"

const storage = new Storage()
//   {
//   area: "local"
// }

// const secureStorage = new SecureStorage()

export const WalletMain = () => {
  const [nostrSession, setNostrSession] = useStorage("nostr-session")

  const [display, setDisplay] = useState<boolean>(false)

  async function newEvent() {
    // todo prompt user for passcode
    setDisplay(true)
    console.log(1111, "newEvent")
    // send to background to process decrypt key and perform task
    let resp = await sendToBackgroundViaRelay({
      name: "open-extension"
    })
    console.log(333, resp)
  }

  useEffect(() => {
    async function load() {
      window.addEventListener("message", (event) => {
        const { id, type, params } = event.data

        if (type === "getPublicKey") {
          newEvent()

          //////
          // console.log(333, "getPublicKey", id, type, params)

          // // // todo, get from storage, the current selected sk
          // const res = getPublicKey("")
          // console.log(444, res)
          // window.nostr._requests[id].resolve(res)

          // setDisplay(true)
        }
      })
    }

    load()
  }, [])

  // const [open, setOpen] = useState(true)

  const cancelButtonRef = useRef(null)

  return (
    <>
      {display && (
        // <div
        //   className="z-50 flex fixed top-32 right-8"
        //   style={{
        //     padding: 8,
        //     background: "purple",
        //     color: "white"
        //   }}>
        //   hello!
        // </div>
        <></>
      )}
      ok
      <Dialog open={display} onClose={() => setDisplay(false)} className="relative z-50">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        
        <div className="fixed w-screen h-screen top-0 bottom-0">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon
                    className="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900">
                    Payment successful
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Eius aliquam laudantium explicabo pariatur iste dolorem
                      animi vitae error totam. At sapiente aliquam accusamus
                      facere veritatis.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                  onClick={() => setDisplay(false)}>
                  Deactivate
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  onClick={() => setDisplay(false)}
                  ref={cancelButtonRef}>
                  Cancel
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>

      {/* <Dialog
      open={display}
      onClose={() => setDisplay(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
          <Dialog.Title>Complete your order</Dialog.Title>

        </Dialog.Panel>
      </div>
    </Dialog> */}

      {/* <Transition.Root show={display} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setDisplay(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Payment successful
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur amet labore.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setDisplay(false)}
                  >
                    Go back to dashboard
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root> */}
      11
    </>
  )
}
