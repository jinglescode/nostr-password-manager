import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  name,
  isError,
  isErrorMessage,
  onKeyUp,
  disabled,
  after,
}: {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  name?: string;
  isError?: boolean;
  isErrorMessage?: string;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  after?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1">
      <div>
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={name}
            type={type}
            name={name}
            className={`block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
              isError
                ? "ring-red-300 focus:ring-red-500"
                : "ring-brand-2 focus:ring-primary"
            }`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyUp={onKeyUp}
            disabled={disabled}
          />
          {after && after}
          {isError && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
        {isError && (
          <p className="mt-2 text-sm text-red-600">
            {isErrorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
