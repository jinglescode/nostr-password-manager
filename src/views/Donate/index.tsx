const donateItems = [
  {
    name: "Tip Directly",
    description: "You can tip directly to the project by sending SATS.",
    href: "https://getalby.com/p/vault",
  },
  {
    name: "Geyser Fund",
    description:
      "Join the global community to support project on crowdfunding platform",
    href: "https://geyser.fund/project/vault/",
  },
];

export default function DonateView() {
  return (
    <div className="w-full h-full p-2 space-y-2">
      <dl className="grid max-w-xl grid-cols-1 gap-y-4">
        {donateItems.map((item) => (
          <div key={item.name} className="flex flex-col">
            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-black">
              {item.name}
            </dt>
            <dd className="flex flex-auto flex-col text-base leading-7 text-gray-800">
              <p className="flex-auto">{item.description}</p>
              <p>
                <a
                  href={item.href}
                  className="text-sm font-semibold leading-6 text-brand-2"
                  target="_blank"
                >
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
