import { SUPPORT } from "../../constants/support";

export default function SupportView() {
  return (
    <div className="w-full h-full p-2 space-y-2">
      <dl className="grid max-w-xl grid-cols-1 gap-y-4">
        {SUPPORT.map((item, i) => (
          <Item item={item} key={i} />
        ))}
      </dl>
    </div>
  );
}

function Item({ item }: { item: any }) {
  return (
    <a
      href={item.href}
      className="relative flex items-center space-x-3 rounded-lg border border-brand-2 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:border-primary"
      target="_blank"
    >
      <div className="min-w-0 flex-1">
        <span className="absolute inset-0" aria-hidden="true" />
        <p className="text-sm font-medium text-brand-black">{item.name}</p>
        <p className="text-sm text-brand-gray">{item.description}</p>
      </div>
    </a>
  );
}
