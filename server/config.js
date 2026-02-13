require('dotenv').config();
const path = require('path');

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is required');
  process.exit(1);
}

module.exports = {
  PORT: process.env.PORT || 3001,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '24h',
  DATA_DIR: process.env.DATA_DIR || path.join(__dirname, 'data'),
};
