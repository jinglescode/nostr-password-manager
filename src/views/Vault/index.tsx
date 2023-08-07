import List from "./List";
import { useUserVaults } from "../../hooks/useUserVaults";
import { useEffect } from "react";
import { Item } from "../../types/item";
import { ItemType } from "../../enums/item";
import StringCrypto from "string-crypto";
import { useNDK } from "@nostr-dev-kit/ndk-react";

export default function VaultView() {
  const { data } = useUserVaults();
  console.log(333, "vault data", data);

  const { ndk, fetchEvents, signer } = useNDK();

  useEffect(() => {
    async function debug() {
      // experiment

      const data: {
        [key: string]: Item;
      } = {
        id111: {
          id: "id111",
          ty: ItemType.LOGIN,
          na: "Google",
          login: {
            un: "jingle@gmail.com",
            pw: "12345",
            ur: ["google.com"],
          },
        },
        id222: {
          id: "id222",
          ty: ItemType.LOGIN,
          na: "Nostr",
          login: {
            un: "jingle@kiwi.com",
            pw: "67890",
            ur: ["nostr.com"],
          },
        },
      };
      const passcode = "123456";
      const ndkUser = await signer?.user();

      // encrypt
      const { encryptString, decryptString } = new StringCrypto();

      const dataString = JSON.stringify(data);
      console.log(1, dataString);
      const encryptedData1 = encryptString(dataString, passcode);
      console.log(2, encryptedData1);
      const encryptedData2 = await signer?.encrypt(ndkUser!, encryptedData1);
      console.log(3, encryptedData2);

      // decrypt
      const decryptedData1 = await signer?.decrypt(ndkUser!, encryptedData2!);
      console.log(4, decryptedData1 == encryptedData1, decryptedData1);
      const decryptedData2 = decryptString(decryptedData1!, passcode);
      console.log(5, decryptedData2 == dataString, decryptedData2);
      const decryptedData3 = JSON.parse(decryptedData2!);
      console.log(6, decryptedData3);
    }
    // debug();
  }, []);

  return (
    <>
      <List />
    </>
  );
}
