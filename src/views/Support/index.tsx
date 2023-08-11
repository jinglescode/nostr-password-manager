const items = [
  {
    name: "Tip Directly",
    description:
      "You can tip directly to the project by sending SATS.",
    href: "https://getalby.com/p/vault",
  },
  {
    name: "Geyser Fund",
    description:
      "Join the global community to support project on Geyser Fund, a crowdfunding platform. The funds will be used to pay for contributors and and bounties.",
    href: "https://geyser.fund/project/vault/",
  },
  {
    name: "Star the GitHub Repo",
    description:
      "Starring a repository shows appreciation for the work. Many of GitHub's repository rankings depend on the number of stars a repository has. In addition, Explore GitHub shows popular repositories based on the number of stars they have, so by staring it, you help NOSTR and freedom tech become more popular.",
    href: "https://github.com/jinglescode/nostr-password-manager",
  },
];

export default function SupportView() {
  return (
    <div className="w-full h-full p-2 space-y-2">
      <dl className="grid max-w-xl grid-cols-1 gap-y-4">
        {items.map((item, i) => (
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
      className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:border-brand-gray-light"
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
