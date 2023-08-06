import { ItemType } from "../enums/item";

export type Item = {
  type: ItemType;
  name: string;
};

export type ItemLogin = Item & {
  username: string;
  password: string;
  uri: string[];
};
