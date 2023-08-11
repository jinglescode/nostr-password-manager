import { useState } from "react";
import SettingsNostrView from "./nostr";
import { SettingViews } from "../../enums/views";
import SettingsSecurityView from "./security";

const navigationItems = [
  {
    name: "NOSTR",
    view: SettingViews.NOSTR,
  },
  {
    name: "Security",
    view: SettingViews.SECURITY,
  },
];

export default function SettingsView() {
  const [settingView, setSettingView] = useState<SettingViews>(
    SettingViews.NOSTR
  );

  return (
    <>
      <main className="w-full h-full">
        <Menu settingView={settingView} setSettingView={setSettingView} />
        <div className="mx-auto max-w-xl">
          <div className="px-4">
            {settingView === SettingViews.NOSTR && <SettingsNostrView />}
            {settingView === SettingViews.SECURITY && <SettingsSecurityView />}
          </div>
        </div>
      </main>
    </>
  );
}

function Menu({
  settingView,
  setSettingView,
}: {
  settingView: SettingViews;
  setSettingView: Function;
}) {
  return (
    <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4">
      <nav className="flex-none px-4">
        <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <a
                className={`group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold cursor-pointer ${
                  item.view === settingView
                    ? "bg-gray-50 text-brand-2"
                    : "text-brand-gray hover:text-primary hover:bg-gray-50"
                }`}
                onClick={() => setSettingView(item.view)}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
