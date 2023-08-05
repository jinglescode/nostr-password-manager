import { Views, viewStore } from "../../stores/view";

export default function MenuView() {
  const view = viewStore((state) => state.view);

  return (
    <div className="bg-gray-800 rounded-b-md">
      <div className="space-y-1 px-2 pb-3">
        {Object.keys(Views).map((v, i) => {
          return (
            <div
              className={`block rounded-md px-3 py-2 text-base font-medium text-white ${
                //@ts-ignore
                view == Views[v] && "bg-gray-900"
              }`}
            >
              {v}
            </div>
          );
        })}
      </div>
    </div>
  );
}
