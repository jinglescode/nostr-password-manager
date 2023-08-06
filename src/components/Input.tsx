export default function Input({
  value,
  onChange,
  type = "text",
  placeholder,
  name,
  isError,
  onKeyUp,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  name?: string;
  isError?: boolean;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
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
    />
  );
}
