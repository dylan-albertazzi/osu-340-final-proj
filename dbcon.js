var mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_albertad',
  password        : process.env.dbPass,
  database        : 'cs340_albertad'
});
module.exports.pool = pool;