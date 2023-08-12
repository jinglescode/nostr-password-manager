import SettingsAccountPasscode from "./passcode";

export default function SettingsSecurityView() {
  return (
    <div>
      <dl className="space-y-2 divide-y divide-gray-100 text-sm leading-6">
        <SettingsAccountPasscode />
      </dl>
    </div>
  );
}
