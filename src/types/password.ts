export type PasswordGeneratorOptions = {
  length?: number;
  ambiguous?: boolean;
  uppercase?: boolean;
  minUppercase?: number;
  lowercase?: boolean;
  minLowercase?: number;
  number?: boolean;
  minNumber?: number;
  special?: boolean;
  minSpecial?: number;
  numWords?: number;
  wordSeparator?: string;
  capitalize?: boolean;
  includeNumber?: boolean;
  type?: "password" | "passphrase";
};
