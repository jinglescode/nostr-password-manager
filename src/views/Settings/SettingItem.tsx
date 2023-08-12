import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import Tooltip from "../../components/Tooltip";

export default function SettingItem({
  label,
  value,
  buttonLabel,
  buttonOnClick,
  tooltip,
}: {
  label: string;
  value: React.ReactNode;
  buttonLabel?: React.ReactNode | string | undefined;
  buttonOnClick: Function;
  tooltip?: React.ReactNode;
}) {
  return (
    <div className="pt-2 sm:flex">
      <dt className="text-base font-semibold leading-7 text-brand-black flex gap-1">
        <div>{label}</div>
        {tooltip && (
          <Tooltip info={tooltip}>
            <QuestionMarkCircleIcon className="h-4 w-4 inline-block text-brand-gray" />
          </Tooltip>
        )}
      </dt>
      <dd className="mt-1 flex justify-between gap-x-4 sm:mt-0 sm:flex-auto">
        <div className="text-brand-black w-full overflow-x-hidden p-1">
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
