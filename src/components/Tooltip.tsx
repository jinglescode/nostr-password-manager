import React from "react";

export default function Tooltip({
  children,
  info,
}: {
  children: React.ReactNode;
  info: React.ReactNode;
}) {
  return (
    <div className="group relative cursor-pointer">
      <div className="absolute invisible bottom-6 group-hover:visible w-64 bg-white text-black mb-1 p-2 rounded-md border border-primary">
        <p className="text-brand-gray text-sm font-light">{info}</p>
      </div>
      <span className="hover:cursor-pointer">{children}</span>
    </div>
  );
}
