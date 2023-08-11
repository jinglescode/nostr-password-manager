export default function Textarea({
  label,
  value,
  onChange,
  placeholder,
  name,
  rows = 6,
  disabled,
}: {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  name?: string;
  rows?: number;
  disabled?: boolean;
}) {
  return (
    <>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-brand-black"
      >
        {label}
      </label>
      <div className="mt-2">
        <textarea
          rows={rows}
          name={name}
          id={name}
          className="block w-full rounded-md border-0 px-2 py-1.5 text-brand-black shadow-sm ring-1 ring-inset ring-brand-2 focus:ring-primary placeholder:text-brand-gray-light sm:text-sm sm:leading-6"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </>
  );
}
