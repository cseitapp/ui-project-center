//@ts-ignore
import CryptoJS from "crypto-js";

export default function (encrypt_msg: string, key: string) {
  var bytes = CryptoJS.AES.decrypt(encrypt_msg, key);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}
