export default function SettingItem({
  label,
  value,
  buttonLabel,
  buttonOnClick,
}: {
  label: string;
  value: React.ReactNode;
  buttonLabel?: React.ReactNode | string | undefined;
  buttonOnClick: Function;
}) {
  return (
    <div className="pt-6 sm:flex">
      <dt className="text-base font-semibold leading-7 text-gray-900">
        {label}
      </dt>
      <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
        <div className="text-gray-900 w-full overflow-x-hidden p-1">{value}</div>
        {buttonLabel && (
          <button
            type="button"
            className="font-semibold text-brand-2 hover:text-primary"
            onClick={() => buttonOnClick()}
          >
            {buttonLabel}
          </button>
        )}
      </dd>
    </div>
  );
}
