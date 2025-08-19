//@ts-ignore

import CryptoJS from "crypto-js";

export default function (msg: string, key: string) {
  var ciphertext = CryptoJS.AES.encrypt(msg, key).toString();

  return ciphertext;
}
