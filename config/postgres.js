const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../.env' });
module.exports = {
  host: process.env.PG_HOST || 'localhost',
  username: process.env.PG_USERNAME || 'karkipy',
  password: process.env.PG_PASSWORD || '',
  database: process.env.PG_DATABASE || 'lpbmis',
  port: process.env.PG_PORT || '5432',
  dialect: 'postgres',
  operatorsAliases: false,
  pool: {
    max: 1000,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
  dialectOptions: {
    useUTC: false, // for reading from database
    // ssl: {
    //   rejectUnauthorized: false
    // },
    ssl: false, // Disable SSL entirely
  },
  timezone: '+05:45', // for writing to database
};