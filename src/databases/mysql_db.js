const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'adp@123',
    database:'demo1'
});

module.exports=pool;