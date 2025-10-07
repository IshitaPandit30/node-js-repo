import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import pool from "./databases/database";

const express = require("express")

const app = express();

const SECRET_KEY = "enxasjdnfdndjfhndjallehddsd";

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
})