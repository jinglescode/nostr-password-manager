// from https://github.com/bitwarden/clients/blob/master/libs/common/src/tools/generator/password/password-generation.service.ts

import { PasswordGeneratorOptions } from "../../types/password";

const DefaultOptions: PasswordGeneratorOptions = {
  length: 14,
  ambiguous: false,
  number: true,
  minNumber: 1,
  uppercase: true,
  minUppercase: 0,
  lowercase: true,
  minLowercase: 0,
  special: false,
  minSpecial: 1,
  type: "password",
  numWords: 3,
  wordSeparator: "-",
  capitalize: false,
  includeNumber: false,
};

export async function generatePassword(
  options?: PasswordGeneratorOptions
): Promise<string> {
  // overload defaults with given options
  const o = Object.assign({}, DefaultOptions, options);

  if (
    o.minUppercase === undefined ||
    o.minLowercase === undefined ||
    o.minNumber === undefined ||
    o.minSpecial === undefined ||
    o.length === undefined
  )
    return "";

  const minLength: number =
    o.minUppercase + o.minLowercase + o.minNumber + o.minSpecial;
  if (o.length < minLength) {
    o.length = minLength;
  }

  const positions: string[] = [];
  if (o.lowercase && o.minLowercase > 0) {
    for (let i = 0; i < o.minLowercase; i++) {
      positions.push("l");
    }
  }
  if (o.uppercase && o.minUppercase > 0) {
    for (let i = 0; i < o.minUppercase; i++) {
      positions.push("u");
    }
  }
  if (o.number && o.minNumber > 0) {
    for (let i = 0; i < o.minNumber; i++) {
      positions.push("n");
    }
  }
  if (o.special && o.minSpecial > 0) {
    for (let i = 0; i < o.minSpecial; i++) {
      positions.push("s");
    }
  }
  while (positions.length < o.length) {
    positions.push("a");
  }

  // build out the char sets
  let allCharSet = "";

  let lowercaseCharSet = "abcdefghijkmnopqrstuvwxyz";
  if (o.ambiguous) {
    lowercaseCharSet += "l";
  }
  if (o.lowercase) {
    allCharSet += lowercaseCharSet;
  }

  let uppercaseCharSet = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  if (o.ambiguous) {
    uppercaseCharSet += "IO";
  }
  if (o.uppercase) {
    allCharSet += uppercaseCharSet;
  }

  let numberCharSet = "23456789";
  if (o.ambiguous) {
    numberCharSet += "01";
  }
  if (o.number) {
    allCharSet += numberCharSet;
  }

  const specialCharSet = "!@#$%^&*";
  if (o.special) {
    allCharSet += specialCharSet;
  }

  let password = "";
  for (let i = 0; i < o.length; i++) {
    let positionChars: string;
    switch (positions[i]) {
      case "l":
        positionChars = lowercaseCharSet;
        break;
      case "u":
        positionChars = uppercaseCharSet;
        break;
      case "n":
        positionChars = numberCharSet;
        break;
      case "s":
        positionChars = specialCharSet;
        break;
      case "a":
        positionChars = allCharSet;
        break;
      default:
        break;
    }

    //@ts-ignore
    const randomCharIndex = randomIntFromInterval(0, positionChars.length - 1);
    //@ts-ignore
    password += positionChars.charAt(randomCharIndex);
  }

  return password;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
