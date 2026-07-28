<<<<<<< HEAD
function encryptText(plainText) {
      if (!plainText) return "";
      return CryptoJS.AES.encrypt(plainText, DB_ENCRYPTION_KEY).toString();
    }

    function decryptText(cipherText) {
      if (!cipherText) return "";
      try {
        const bytes = CryptoJS.AES.decrypt(cipherText, DB_ENCRYPTION_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText || cipherText;
      } catch (e) {
        return cipherText;
      }
    }
=======
const DB_ENCRYPTION_KEY = "polaris-sanctuary-secret-key";

function encryptText(plainText) {
  if (!plainText) return "";
  return CryptoJS.AES.encrypt(plainText, DB_ENCRYPTION_KEY).toString();
}

function decryptText(cipherText) {
  if (!cipherText) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, DB_ENCRYPTION_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || cipherText;
  } catch (e) {
    return cipherText;
  }
}
>>>>>>> fdd33070c53ed3e95d9949dca616633974a8b562
