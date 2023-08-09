import { useState } from "react";
import SettingItem from "../SettingItem";
import { TrashIcon } from "@heroicons/react/20/solid";
import Input from "../../../components/Input";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { viewStore } from "../../../stores/view";
import { useSettingsStore } from "../../../stores/settings";

export default function SettingsNostrRelay() {
  const { ndk } = useNDK();
  const relays = useSettingsStore((state) => state.relays);
  const setRelays = useSettingsStore((state) => state.setRelays);
  const setAppNotification = viewStore((state) => state.setAppNotification);

  const [editRelay, setEditRelay] = useState<boolean>(false);
  const [inputRelay, setInputRelay] = useState<string>("");
  
  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.keyCode === 13) {
      let updatedRelaySet = [...relays];
      updatedRelaySet.push(inputRelay);
      setRelays(updatedRelaySet);
      setAppNotification({
        title: "Relay added",
        message: "Will only take effect after reopen.",
        type: "success",
      });
      setInputRelay("");
    }
  }

  function deleteRelay(index: number) {
    const updatedRelaySet = [...relays];
    updatedRelaySet.splice(index, 1);
    setRelays(updatedRelaySet);
    setAppNotification({
      title: "Relay removed",
      message: "Will only take effect after reopen.",
      type: "success",
    });
  }

  return (
    <SettingItem
      label="Relays"
      value={
        <>
          {relays.map((relay, index) => {
            const thisRelay = ndk?.pool.relays.get(relay);
            return (
              <div key={index} className="flex items-center">
                <span
                  className={`mr-2 w-2 h-2 rounded-full ${
                    thisRelay?.status ? "bg-green-700" : "bg-red-700"
                  }`}
                ></span>
                <span className="flex-1">{relay}</span>
                {editRelay && (
                  <button
                    onClick={() => deleteRelay(index)}
                    className="text-gray-400 hover:text-brand-3 active:text-primary"
                    title={`Delete ${relay}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
          {editRelay && (
            <Input
              label="Add relay"
              value={inputRelay}
              onChange={(e) => setInputRelay(e.target.value)}
              placeholder={`wss://relay.example.com`}
              disabled={!ndk}
              onKeyUp={handleKeyUp}
            />
          )}
        </>
      }
      buttonLabel={editRelay ? undefined : "Update"}
      buttonOnClick={() => {
        setEditRelay(!editRelay);
      }}
    />
  );
}
