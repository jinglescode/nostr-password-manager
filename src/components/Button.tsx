export default function Button({
  children,
  onClick,
  disabled,
  className,
  title,
  hasGradientBackground,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
  hasGradientBackground?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-md bg-brand-2 px-3.5 py-2.5 text-center items-center justify-center inline-flex text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        disabled && "opacity-50 cursor-not-allowed"
      }} ${className && className}`}
      style={
        hasGradientBackground
          ? {
              backgroundImage:
                "radial-gradient(farthest-corner at 100% 0px, #7C6FFD 0%, #2FB6FF 100%)",
            }
          : {}
      }
      title={title}
    >
      {children}
    </button>
  );
}
