const mysql2 = require('mysql2');
const mysqlOption = require('./mysql2options.json');
let pool = mysql2.createPool(mysqlOption);

module.exports = pool;