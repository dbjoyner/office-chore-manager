const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3001,
  JWT_SECRET: process.env.JWT_SECRET || 'office-chore-manager-secret-key-change-in-production',
  JWT_EXPIRY: '24h',
  DATA_DIR: path.join(__dirname, 'data'),
};
