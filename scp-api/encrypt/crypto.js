const crypto = require("crypto")

// Function to encrypt data
function encrypt(text, key) {
  // Generate a random initialization vector
  const iv = process.env.IV

  // Create cipher with AES-256-CBC
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  // Encrypt the data
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return both the encrypted data and the IV
  return encrypted;
}

// Function to decrypt data
function decrypt(encryptedData, key) {
  // Create decipher
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key,
    process.env.IV
  );

  // Decrypt the data
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

function encryptArray(array) {
  newArray = array.map((element) =>
    encrypt(String(element), key)
  );
  return newArray
}

function decryptRequest(object, key) {
  object.title = decrypt(object.title, key)
  object.description = decrypt(object.description, key)
  object.status = decrypt(object.status, key)
  object.category = decrypt(object.category, key)
  return;
}

function decryptMessage(object, key) {
  object.content = decrypt(object.content, key)
  return;
}

function decryptUser(object, key) {
  object.username = decrypt(object.username, key)
  object.first_name = decrypt(object.first_name, key)
  object.last_name = decrypt(object.last_name, key)
  object.email = decrypt(object.email, key)
  object.address = decrypt(object.address, key)
  object.postcode = decrypt(object.postcode, key)
  object.borough = decrypt(object.borough, key)
  return;
}

// Example usage
// Note: In a real application, use a properly generated and securely stored key
// const key = crypto.scryptSync('secretPassword', 'salt', 32); // 32 bytes = 256 bits
// const message = 'This is a secret message';

// // Encrypt
// const encryptedData = encrypt(message, key);
// console.log('Original:', message);
// console.log('Encrypted:', encryptedData);

// // Decrypt
// const decrypted = decrypt(encryptedData, key);
// console.log('Decrypted:', decrypted);

module.exports = {
  encrypt, 
  encryptArray, 
  decrypt, 
  decryptRequest,
  decryptMessage,
  decryptUser
}