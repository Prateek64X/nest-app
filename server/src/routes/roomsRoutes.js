import express from 'express';
import db from '../db/index.js';
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post('/create', verifyToken, async (req, res) => {
    const { name, floor, price } = req.body;
    console.log("req.admin = ",req.admin);
    const { id: admin_id } = req.admin;

    if (!name || !floor || !price) {
        return res.status(400).json({ error: "All fields are required "});
    }

    try {
        const result = await db.query(
            `INSERT INTO rooms (admin_id, tenant_id, name, floor, price, occupied)
            VALUES ($1, $2, $3, $4, $5, false)
            RETURNING *`,
            [admin_id, null, name, floor, price]
        );

        res.status(201).json({
            success: true,
            message: "Room created successfully",
            room: {
                id: result.rows[0].id
            }
        });

    } catch (err) {
        console.error("Error creating room:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

router.get('/', verifyToken, async (req, res) => {
    const { id: admin_id } = req.admin;

    try {
        const result = await db.query(
            `SELECT * FROM rooms WHERE admin_id = $1 ORDER BY created_at DESC`,
            [admin_id]
        );

        res.json({ success: true, rooms: result.rows });
    } catch (err) {
        console.error("Error fetching rooms:", err);
        res.status(500).json({ error: "Server error while fetching rooms" });
    }
});

router.patch('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, floor, price } = req.body;

    if (!name || !floor || !price) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const result = await db.query(
            `UPDATE rooms
            SET name = $1, floor = $2, price = $3
            WHERE id = $4 AND admin_id = $5
            RETURNING *`,
            [name, floor, price, id, req.admin.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Room not found or unauthorized" });
        }

        res.status(200).json({
            success: true,
            message: "Room updated successfully",
            room: result.rows[0],
        });

    } catch (err) {
        console.error("Error updating room:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;