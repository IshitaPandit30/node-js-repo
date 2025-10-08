require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",        
  host: process.env.POSTGRESS_HOST,      
  database: process.env.POSTGRESS_DB,     
  password: process.env.POSTGRESS,
  port: 5432,              
});

module.exports = pool;
