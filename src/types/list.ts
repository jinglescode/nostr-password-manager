import { Item } from "./item";

export type List = {
  id: string;
  mod: number;
  items: {
    [key: string]: Item;
  };
};
