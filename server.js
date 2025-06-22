// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// configure your connection string as needed
const pool = new Pool({
    connectionString: 'postgresql://postgres:yourpassword@localhost:5432/crud_app'
});

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // serve index.html + script.js

// --- CRUD routes ---

// READ all
app.get('/items', async (req, res) => {
    const result = await pool.query('SELECT * FROM items ORDER BY id');
    res.json(result.rows);
});

// CREATE
app.post('/items', async (req, res) => {
    const { name } = req.body;
    const result = await pool.query(
        'INSERT INTO items(name) VALUES($1) RETURNING *',
        [name]
    );
    res.status(201).json(result.rows[0]);
});

// UPDATE
app.put('/items/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await pool.query(
        'UPDATE items SET name = $1 WHERE id = $2 RETURNING *',
        [name, id]
    );
    res.json(result.rows[0]);
});

// DELETE
app.delete('/items/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM items WHERE id = $1', [id]);
    res.sendStatus(204);
});

// start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
