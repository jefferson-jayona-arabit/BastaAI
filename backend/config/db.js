const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'bastaai_db',
    port: process.env.DB_PORT || 5432,
});

pool.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to the database:', err.message);
    } else {
        console.log('✅ Connected to the PostgreSQL database');
    }
});

module.exports = pool;