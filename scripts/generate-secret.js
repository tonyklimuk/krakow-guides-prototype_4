const crypto = require('crypto');

// Generate a random secret key for NextAuth
const secret = crypto.randomBytes(32).toString('hex');

console.log('Generated NextAuth Secret:');
console.log(secret);
console.log('\nAdd this to your .env file:');
console.log(`NEXTAUTH_SECRET="${secret}"`);
