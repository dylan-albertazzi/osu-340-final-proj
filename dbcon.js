var mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'cs340-final-proj.c0zp3vzzyv54.us-west-2.rds.amazonaws.com',
  user            : 'admin',
  password        : process.env.dbPass,
  database        : 'cs340-final-proj'
});
module.exports.pool = pool;  