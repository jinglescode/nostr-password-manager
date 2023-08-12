import {
  CheckIcon,
  EllipsisHorizontalIcon,
  WrenchIcon,
} from "@heroicons/react/20/solid";
import { Virtuoso } from "react-virtuoso";
import { ROADMAP } from "../../constants/roadmap";

export default function RoadmapView() {
  function rowRenderer({ index, item }: { index: number; item: any }) {
    return <RoadmapItem key={index} index={index} item={item} />;
  }

  return (
    <ul className="w-full h-full">
      <Virtuoso
        style={{ height: "100%" }}
        data={ROADMAP}
        itemContent={(index, item) => rowRenderer({ index, item })}
      />
    </ul>
  );
}

function RoadmapItem({ index, item }: { index: number; item: any }) {
  const isNotLast = index !== ROADMAP.length - 1;
  return (
    <li className="mx-4 pt-2">
      <div className={`relative ${isNotLast ? "pb-8" : "pb-2"}`}>
        {isNotLast ? (
          <span
            className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
        ) : null}
        <div className="relative flex space-x-3">
          <div>
            <span
              className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                item.state === 2
                  ? "bg-primary"
                  : item.state === 1
                  ? "bg-brand-2"
                  : "bg-gray-400"
              }`}
            >
              {(item.state === 0 || item.state === undefined) && (
                <EllipsisHorizontalIcon className="h-5 w-5 text-white" />
              )}
              {item.state === 1 && (
                <WrenchIcon className="h-5 w-5 text-white" />
              )}
              {item.state === 2 && <CheckIcon className="h-5 w-5 text-white" />}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
            <div>
              <p className="text-sm text-brand-black">{item.desc}</p>
            </div>
            <div className="whitespace-nowrap text-right text-sm text-brand-gray">
              {item.datetime && (
                <time dateTime={item.datetime}>{item.datetime}</time>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
