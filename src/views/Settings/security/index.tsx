import SettingsAccountPasscode from "./passcode";

export default function SettingsSecurityView() {
  return (
    <div>
      {/* <h2 className="text-base font-semibold leading-7 text-gray-900">
        Security
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-500">
        Manage your security settings.
      </p> */}
      <dl className="space-y-6 divide-y divide-gray-100 text-sm leading-6">
        <SettingsAccountPasscode />
      </dl>
    </div>
  );
}
