export default function SettingItem({
  label,
  value,
  buttonLabel,
  buttonOnClick,
}: {
  label: string;
  value: React.ReactNode;
  buttonLabel?: string | undefined;
  buttonOnClick: Function;
}) {
  return (
    <div className="pt-6 sm:flex">
      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
        {label}
      </dt>
      <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
        <div className="text-gray-900 text-ellipsis overflow-x-hidden w-full">
          {value}
        </div>
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
