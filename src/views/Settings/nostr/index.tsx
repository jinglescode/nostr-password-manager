import SettingsNostrRelay from "./relay";
import SettingsNostrAccount from "./account";
import SettingsNostrData from "./data";

export default function SettingsNostrView() {
  return (
    <div>
      <dl className="space-y-2 divide-y divide-gray-100 text-sm leading-6">
        <SettingsNostrAccount />
        <SettingsNostrRelay />
        <SettingsNostrData />
      </dl>
    </div>
  );
}
