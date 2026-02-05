const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
    host: 'db',
    user: 'user',
    password: 'password',
    database: 'mydatabase',
    port: 5432,
});

// Create table on startup
(async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
                                             id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
        );
    `);
    console.log('Table ready');
})();

const server = http.createServer(async (req, res) => {
    // ✅ CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ✅ Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    try {
        await pool.query('INSERT INTO users DEFAULT VALUES');
        const { rows } = await pool.query('SELECT * FROM users');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(err.message);
    }
});


server.listen(3000, () => {
    console.log('Server running on port 3000');
});
