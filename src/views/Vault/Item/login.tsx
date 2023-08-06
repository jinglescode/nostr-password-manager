import { KeyIcon, UserIcon } from "@heroicons/react/20/solid";
import { Item } from "../../../types/item";
import { ItemKeys } from "../../../enums/item";
import { useClipboard } from "../../../hooks/useCopyClipboard";

export default function LoginItem({ item }: { item: Item }) {
  const { onCopy: copyUser } = useClipboard(
    item.login ? item.login[ItemKeys.USERNAME] : ""
  );

  const { onCopy: copyPassword } = useClipboard(
    item.login ? item.login[ItemKeys.PASSWORD] : ""
  );

  if (item.login === undefined) return <></>;

  return (
    <div className="whitespace-nowrap text-sm py-2 overflow-x-hidden">
      <div className="flex items-center mx-4">
        <div className="flex-grow overflow-x-hidden">
          <p className="font-medium text-gray-900 text-ellipsis overflow-x-hidden">
            {item[ItemKeys.NAME]}
          </p>
          <p className="text-gray-500 text-ellipsis overflow-x-hidden">
            {item.login[ItemKeys.USERNAME]}
          </p>
        </div>
        <div className="flex-none text-gray-500 flex items-center">
          <button
            onClick={() => copyUser()}
            className="text-gray-400 hover:text-brand-3 active:text-primary"
            title="Copy username"
          >
            <UserIcon className="h-8 w-8" />
          </button>
          <button
            onClick={() => copyPassword()}
            className="text-gray-400 hover:text-brand-3 active:text-primary"
            title="Copy password"
          >
            <KeyIcon className="h-8 w-8" />
          </button>
        </div>
      </div>
    </div>
  );
  // return (
  //   <tr>
  //     <td className="whitespace-nowrap text-sm py-2">
  //       <div className="flex items-center mx-4">
  //         <div className="flex-1">
  //           <div className="font-medium text-gray-900">
  //             {item[ItemKeys.NAME]}
  //           </div>
  //           <div className="mt-1 text-gray-500">
  //             {item.login[ItemKeys.USERNAME]}
  //           </div>
  //         </div>
  //         <div className="text-gray-500 flex items-center">
  //           <button onClick={() => copyUser()}>
  //             <UserIcon className="h-8 w-8 text-gray-400 hover:text-gray-600" />
  //           </button>
  //           <button onClick={() => copyPassword()}>
  //             <KeyIcon className="h-8 w-8 text-gray-400 hover:text-gray-600" />
  //           </button>
  //         </div>
  //       </div>
  //     </td>
  //   </tr>
  // );
}
