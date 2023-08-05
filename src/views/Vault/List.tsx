import { KeyIcon, UserIcon } from "@heroicons/react/20/solid";

export default function List() {
  let items = [
    {
      site: "google.com",
      email: "jinglescode@gmail.com",
    },
    {
      site: "nostr.com",
      email: "jinglescode@gmail.com",
    },
  ];

  // function fillForms() {
  //   // console.log("fillForms");
  //   // var email = document.querySelector('input[type="email"]');
  //   // console.log(222, email);

  //   // if (email) {
  //   //   //@ts-ignore
  //   //   email.value = "jinglescode@gmail.com";
  //   // }

  //   chrome.runtime.sendMessage(
  //     {
  //       type: "DEBUG",
  //       payload: {
  //         message: "Hello, my name is Con. I am from ContentScript.",
  //       },
  //     },
  //     (response) => {
  //       console.log(response);
  //     }
  //   );
  // }

  function copyUser() {}

  function copyPassword() {}

  return (
    <table className="min-w-full divide-y divide-gray-300">
      <tbody className="divide-y divide-gray-200 bg-white">
        {items.map((item, i) => {
          return (
            <tr key={i}>
              <td className="whitespace-nowrap text-sm py-2">
                <div className="flex items-center mx-4">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.site}</div>
                    <div className="mt-1 text-gray-500">{item.email}</div>
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
        })}
      </tbody>
    </table>
  );
}
