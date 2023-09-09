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
import { MESSAGE } from "~messages"
import { getSessionStorage } from "~utils/chrome/storage"

const storage = new Storage()
//   {
//   area: "local"
// }

// const secureStorage = new SecureStorage()

export enum MODALVIEW {
  RequestDecryptPassword
}

export const WalletMain = () => {
  const [nostrSession, setNostrSession] = useStorage("nostr-session")

  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalView, setModalView] = useState<MODALVIEW | undefined>(undefined)

  const [requestId, setRequestId] = useState<string>("")

  // password
  const [vaultPassword, setVaultPassword] = useState<string>("")
  const [invalidVaultPassword, setInvalidVaultPassword] =
    useState<boolean>(false)

  useEffect(() => {
    async function load() {
      window.addEventListener("message", (event) => {
        const { id, ext, type, params } = event.data

        if (ext != undefined && ext == "vault") {
          console.log("message", event.data)

          setRequestId(id)

          if (type === "getPublicKey") {
            requestPubkey(id)
          }
        }
      })
    }

    load()
  }, [])

  async function requestPubkey(requestId: string) {
    let resp = await sendToBackgroundViaRelay({
      name: "nostr",
      body: {
        type: MESSAGE.RequestPubkey,
        requestId: requestId
      }
    })
    await requestPubkeyResp(requestId, resp)
  }

  async function requestPubkeyResp(requestId: string, resp: any) {
    console.log(333, "requestPubkeyResp", resp)

    // if keys are still encrypted
    if (resp.type == MESSAGE.RequestDecryptPassword) {
      // if wrong password
      if (resp.data.error == MESSAGE.InvalidPassword) {
        setInvalidVaultPassword(true)
      } else {
        setInvalidVaultPassword(false)
      }
      setModalView(MODALVIEW.RequestDecryptPassword)
      setShowModal(true)
    }
    // if keys are decrypted
    if (resp.type == MESSAGE.WalletSelected) {
      window.nostr._requests[requestId].resolve(resp.data.pubkey)
    }
  }

  async function setPassword() {
    setShowModal(false)
    let resp = await sendToBackgroundViaRelay({
      name: "nostr",
      body: {
        type: MESSAGE.SetDecryptPassword,
        requestId: requestId,
        data: vaultPassword
      }
    })
    await requestPubkeyResp(requestId, resp)
  }

  return (
    <>
      {showModal && (
        <div className="z-50 flex fixed top-0 left-0 w-screen h-screen">
          <div className="container flex justify-center mx-auto">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
              <div className="relative w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Vault
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => setShowModal(false)}>
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14">
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {modalView == MODALVIEW.RequestDecryptPassword && (
                      <>
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                          Please enter your password to decrypt your private
                          key.
                        </p>
                        <div>
                          <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Password to decrypt key
                          </label>
                          <input
                            type="password"
                            id="password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="password"
                            value={vaultPassword}
                            onChange={(e) => setVaultPassword(e.target.value)}
                          />
                          {invalidVaultPassword && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                              <span className="font-medium">
                                Invalid password
                              </span>
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={() => setPassword()}>
                      Unlock Vault
                    </button>
                    <button
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
