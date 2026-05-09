// backend/utils/encryption.js
const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.AES_SECRET_KEY || 'bastaai_aes_secret_key_32chars!!'; // Must be 32 chars
const IV_LENGTH = 16; // AES block size

// =====================
// ENCRYPT
// =====================
const encrypt = (text) => {
    if (!text) return null;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
    let encrypted = cipher.update(text.toString());
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    // Store iv:encryptedData as one string
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// =====================
// DECRYPT
// =====================
const decrypt = (text) => {
    if (!text) return null;
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

module.exports = { encrypt, decrypt };