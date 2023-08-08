export function makeId(length = 8) {
  // let result = "";
  // const characters =
  //   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // const charactersLength = characters.length;
  // let counter = 0;
  // while (counter < length) {
  //   result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //   counter += 1;
  // }
  // return result;

  return Math.random().toString(36).slice(-length);
}
