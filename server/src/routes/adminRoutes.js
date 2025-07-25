import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db/index.js';
import { generateToken } from "../utils/jwt.js";

const router = express.Router();

router.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ error: "Phone number and password are required "});
    }

    try {
        // 1. Fetch phone_number
        const result = await db.query(
            `SELECT * from admins WHERE phone_number = $1`,
            [phone]
        );

        const admin = result.rows[0];

        if (!admin) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 3. Generate JWT
        const token = generateToken({
            id: admin.id,
        });

        // 4. Return success + token
        res.status(201).json({
            success: true,
            message: "Login successful",
            token,
            admin: {
                id: admin.id
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post('/register', async (req, res) => {
    const { name, phone, email, password, home_name } = req.body;

    if (!name || !phone || !password || !home_name) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            `INSERT INTO admins (id, full_name, phone_number, email, password, home_name)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
            RETURNING id, full_name, phone_number, home_name, created_at`,
            [name, phone, email, hashedPassword, home_name]
        );

        const admin = result.rows[0];

        const token = generateToken({
            id: admin.id,
        });

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            admin: {
                id: admin.id
            }
        });
    } catch (err) {
        console.error("Register error:", err);

        // Check for unique constraint violation (duplicate phone)
        if (err.code === '23505' && err.constraint === 'unique_phone') {
            return res.status(409).json({ error: "Phone number already registered" });
        }

        res.status(500).json({ error: "Server error" });
    }
});


/// Remove Later - To use the verifyToken code, We need to post like this
// router.get(/tenants/:id, verifyToken, async(req, res) => {
// // Other unprotected routes are called like
// router.post('/register', async (req, res) => {

export default router;