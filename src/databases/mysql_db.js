require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL,
  database: process.env.MYSQL_DB,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully!');
    connection.release();
  } catch (err) {
    console.error('❌ Error connecting to MySQL Database:', err.message);
  }
})();

module.exports = pool;
