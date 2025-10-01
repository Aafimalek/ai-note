import { AES, enc } from "crypto-js";

export const encryptNote = (content: string, password: string): string => {
  return AES.encrypt(content, password).toString();
};

export const decryptNote = (
  encryptedContent: string,
  password: string
): string | null => {
  try {
    const bytes = AES.decrypt(encryptedContent, password);
    const decryptedContent = bytes.toString(enc.Utf8);
    return decryptedContent || null;
  } catch (error) {
    return null;
  }
};
