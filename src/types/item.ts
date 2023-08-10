import { ItemKeys, ItemType } from "../enums/item";

export type Item = {
  id: string;
  [ItemKeys.TYPE]: ItemType;
  [ItemKeys.NAME]: string;
  login?: {
    [ItemKeys.USERNAME]: string;
    [ItemKeys.PASSWORD]: string;
    [ItemKeys.URI]: string[];
  };
  note?: {
    [ItemKeys.TEXT]: string;
  };
  vaultId?: string;
};
