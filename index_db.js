require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt")
const pool = require("./src/databases/mysql_db");
const jwt = require('jsonwebtoken');
console.log('env', process.env.JWT_SECRET);

const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const hashed_password = await bcrypt.hash(password, 10);
        console.log("hashed_password:", hashed_password);

        const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
        const [response] = await pool.query(query, [username, hashed_password]);

        res.status(201).json({ message: "User registered successfully", id: response.insertId });
    } catch (err) {
        console.error("Error in /register:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Step 1: Validate input
        if (!username || !password) {
            return res.status(400).json({ msg: 'Username and password are required' });
        }

        // Step 2: Fetch user by username
        const query = `SELECT * FROM users WHERE username = ?`;
        const [rows] = await pool.query(query, [username]);

        await console.log('rowsdata', rows);


        // Step 3: If user not found
        if (rows.length === 0) {
            return res.status(401).json({ msg: 'Invalid username or password' });
        }

        const user = rows[0];

        console.log("Fetched user:", user);

        // Step 4: Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid username or password' });
        }

        // Step 5: Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || "ABC",
            { expiresIn: "1h" }
        );

        // Step 6: Send success response
        res.status(200).json({
            msg: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
            },
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

const verifyToken = (req, res, next) => {
    const authorization = req.headers["authorization"]


    const token = authorization && authorization.split(" ")[1];
    console.log('authorization', token);

    if (!token) {
        res.status(401).json({ error: "Access denied. Invalid token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('decoded', decoded);
        
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token." });
    }
}

app.get('/getusers', verifyToken, async (req, res) => {

    try {
        const query = `select * from users`;

        let response = await pool.query(query);

        res.json(response?.[0]);

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Not able to get the user' })
    }

})


app.listen(3000, () => console.log("App is running at port 3000"));
