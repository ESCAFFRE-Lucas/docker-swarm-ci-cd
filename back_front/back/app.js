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

    if (req.url === '/test/cpu') {
        console.log('⚠️ Alerte : Début du test CPU !');
        for (let i = 0; i < 10000 * 10000; i++) {
            Math.sqrt(Math.sqrt(i*i)+Math.sqrt(i*i));
        }
        console.log('✅ Fin du test CPU');
        res.writeHead(200);
        res.end(JSON.stringify({ status: "CPU a bien chauffé 🔥" }));
        return;
    }

    if (req.url === '/test/freeze') {
        console.log('❄️ ALERTE : GEL DU SERVEUR DANS 1 SECONDE !');
        res.write("Le serveur va geler...");

        setTimeout(() => {
            console.log("❄️ C'est parti pour l'éternité...");
            while(true) {
                Math.random();
            }
        }, 100);
        return;
    }

    if (req.url === '/test/error') {
        console.error('❌ ERREUR CRITIQUE SIMULÉE !');
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Oups, tout est cassé" }));
        return;
    }

    if (req.url === '/test/kill') {
        console.warn('☠️ Arrêt du processus demandé...');
        res.end("Adieu monde cruel...");
        process.exit(1);
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
