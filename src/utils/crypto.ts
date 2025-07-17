import * as Crypto from 'expo-crypto';
import { decode, encode } from 'base-64';

if (!global.btoa) { global.btoa = encode; }
if (!global.atob) { global.atob = decode; }

export const hashPassword = async (password: string): Promise<string> => {
    const salt = "vita-track-super-secret-salt";
    return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password + salt
    );
};

export const encryptData = (data: object): string | null => {
  try {
    return btoa(JSON.stringify(data));
  } catch (e) {
    console.error("Encryption failed", e);
    return null;
  }
};

export const decryptData = (encryptedData: string): any | null => {
  try {
    if (!encryptedData) return null;
    return JSON.parse(atob(encryptedData));
  } catch (e) {
    console.error("Decryption failed", e);
    return null;
  }
};