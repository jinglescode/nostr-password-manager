import { ItemKeys, ItemType } from "../enums/item";

export type Item = {
  [ItemKeys.TYPE]: ItemType;
  [ItemKeys.NAME]: string;
  login?: {
    [ItemKeys.USERNAME]: string;
    [ItemKeys.PASSWORD]: string;
    [ItemKeys.URI]: string[];
  };
  listId?: string;
};
