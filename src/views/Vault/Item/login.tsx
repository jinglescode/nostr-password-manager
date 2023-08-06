import { KeyIcon, UserIcon } from "@heroicons/react/20/solid";
import { ItemLogin } from "../../../types/item";

export default function LoginItem({ item }: { item: ItemLogin }) {
  function copyUser() {}

  function copyPassword() {}

  return (
    <tr>
      <td className="whitespace-nowrap text-sm py-2">
        <div className="flex items-center mx-4">
          <div className="flex-1">
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="mt-1 text-gray-500">{item.username}</div>
          </div>
          <div className="text-gray-500 flex items-center">
            <button onClick={() => copyUser()}>
              <UserIcon className="h-8 w-8 text-gray-400 hover:text-gray-600" />
            </button>
            <button onClick={() => copyPassword()}>
              <KeyIcon className="h-8 w-8 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}
