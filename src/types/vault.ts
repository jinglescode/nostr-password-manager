import { Item } from "./item";

export type Vault = {
  id: string;
  mod: number;
  items: {
    [key: string]: Item;
  };
  encryptedItems: string;
};
