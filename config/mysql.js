const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../.env' });
module.exports = {
  host: process.env.MYSQL_HOST || 'localhost',
  username: process.env.MYSQL_USERNAME || 'karkipy',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'lpbmis',
  port: process.env.MYSQL_PORT || '5432',
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max: 1000,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
  dialectOptions: {
    // useUTC: false, // for reading from database
    // ssl: {
    //   rejectUnauthorized: false
    // },
    ssl: false, // Disable SSL entirely
  },
  timezone: '+05:45', // for writing to database
};