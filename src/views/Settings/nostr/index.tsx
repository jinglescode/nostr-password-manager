import SettingsNostrRelay from "./relay";
import SettingsNostrAccount from "./account";
import SettingsNostrData from "./data";

export default function SettingsNostrView() {
  return (
    <div>
      {/* <h2 className="text-base font-semibold leading-7 text-gray-900">NOSTR</h2>
      <p className="mt-1 text-sm leading-6 text-gray-500">
        How you are connected to the NOSTR network.
      </p> */}
      <dl className="space-y-6 divide-y divide-gray-100 text-sm leading-6">
        {/* mt-6 border-t border-gray-200 */}
        <SettingsNostrAccount />
        <SettingsNostrRelay />
        <SettingsNostrData />
      </dl>
    </div>
  );
}
