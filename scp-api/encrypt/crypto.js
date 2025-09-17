const crypto = require("crypto")

// Function to encrypt data
function encrypt(text, key) {
  // Generate a random initialization vector
  const iv = crypto.randomBytes(16);

  // Create cipher with AES-256-CBC
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  // Encrypt the data
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return both the encrypted data and the IV
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted
  };
}

// Function to decrypt data
function decrypt(encryptedData, iv, key) {
  // Create decipher
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key,
    Buffer.from(iv, 'hex')
  );

  // Decrypt the data
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Example usage
// Note: In a real application, use a properly generated and securely stored key
const key = crypto.scryptSync('secretPassword', 'salt', 32); // 32 bytes = 256 bits
const message = 'This is a secret message';

// Encrypt
const { iv, encryptedData } = encrypt(message, key);
console.log('Original:', message);
console.log('Encrypted:', encryptedData);
console.log('IV:', iv);

// Decrypt
const decrypted = decrypt(encryptedData, iv, key);
console.log('Decrypted:', decrypted);