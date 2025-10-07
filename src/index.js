const bcrypt = require("bcrypt")
const express = require('express');
const pool = require('./databases/database');

const jwt = require('jsonwebtoken')

let app = express();

app.use(express.json());

const SECRET_KEY = "Ishita_Sercer_KEY";


let PORT = 3000;

app.get('/', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM employee_detail");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

app.post('/entervalue', async (req, res) => {
    let val = req.body;
    console.log('val', val);

    try {
        const { id, name, age, salary } = val;

        const query = `
        INSERT INTO employee_detail (id, name, age, salary)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

        const values = [id, name, age, salary];

        const result = await pool.query(query, values);

        console.log('Inserted row:', result.rows[0]);

        res.json({ message: 'Data inserted successfully', data: result.rows[0] });

    } catch (err) {
        console.error("An error occurred", err);
        res.status(500).json({ error: "Internal server error" });
    }


})

app.delete('/deletedata/:id', async (req, res) => {
    let id = req.params.id;
    console.log('id', id);

    const query = `
        DELETE FROM employee_detail WHERE id = $1 RETURNING *;
    `;
    try {
        let response = await pool.query(query, [id]);
        res.json({ "data deleted successfully": response });
    } catch (err) {
        console.error("An error occurred", err);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.put("/update/:id", async (req, res) => {
    let id = req.params.id;
    let { age, salary } = req.body

    const query = `
        UPDATE employee_detail SET age=$1, salary=$2 WHERE id = $3 RETURNING *;
    `;
    try {
        let response = await pool.query(query, [age, salary, id]);
        res.json({ "data deleted successfully": response });
    } catch (err) {
        console.error("An error occurred", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hash_password = await bcrypt.hash(password, 10);

        const query = `INSERT INTO users (username, password) values ($1, $2)`;

        const result = await pool.query(query, [username, hash_password]);

        res.status(201).json({ message: "User Registered", user: result.rows[0] })
    } catch (err) {
        console.error("Error in register", err);
        res.status(500).json({ error: "Registration failed" });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const query = `SELECT * FROM users WHERE username = $1`;
        const result = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = result.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.user_id, username: user.username },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });

    } catch (err) {
        console.error("Error in login", err);
        res.status(500).json({ error: "Login failed" });
    }
});


app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`);

})