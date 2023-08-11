import SettingsAccountPasscode from "./passcode";

export default function SettingsSecurityView() {
  return (
    <div>
      {/* <h2 className="text-base font-semibold leading-7 text-brand-black">
        Security
      </h2>
      <p className="mt-1 text-sm leading-6 text-brand-gray-light">
        Manage your security settings.
      </p> */}
      <dl className="space-y-2 divide-y divide-gray-100 text-sm leading-6">
        <SettingsAccountPasscode />
      </dl>
    </div>
  );
}
