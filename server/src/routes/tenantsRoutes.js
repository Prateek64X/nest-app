import express from 'express';
import db from '../db/index.js';
import { verifyToken } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * Create a tenant + assign to rooms
 */
router.post('/create', verifyToken, async (req, res) => {
    const { full_name, phone, password, move_in_date, move_out_date, rooms } = req.body;
    const { id: admin_id } = req.admin;

    if (!full_name || !phone || !rooms || rooms.length === 0) {
        return res.status(400).json({ error: "Missing required fields or no rooms selected" });
    }

    const client = await db.connect();
    const tenantId = uuidv4();

    try {
        await client.query('BEGIN');

        // 1. Insert into tenants
        await client.query(
            `INSERT INTO tenants (id, full_name, phone, password, move_in_date, move_out_date)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [tenantId, full_name, phone, password, move_in_date, move_out_date]
        );

        for (const room of rooms) {
            const { id: roomId, price } = room;

            // 2. Add to tenant_rooms table
            await client.query(
                `INSERT INTO tenant_rooms (tenant_id, room_id, price)
                 VALUES ($1, $2, $3)`,
                [tenantId, roomId, price]
            );

            // 3. Update room to set tenant_id and occupied = true
            await client.query(
                `UPDATE rooms SET tenant_id = $1, occupied = true
                 WHERE id = $2 AND admin_id = $3`,
                [tenantId, roomId, admin_id]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: "Tenant created and rooms assigned successfully",
            tenantId
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error creating tenant:", err);
        res.status(500).json({ error: "Something went wrong" });
    } finally {
        client.release();
    }
});

/**
 * Get all tenants for current admin
 */
router.get('/', verifyToken, async (req, res) => {
    const { id: admin_id } = req.admin;

    try {
        const result = await db.query(
            `SELECT t.*, 
                    json_agg(json_build_object(
                        'room_id', r.id,
                        'name', r.name,
                        'floor', r.floor,
                        'price', tr.price
                    )) AS rooms
             FROM tenants t
             JOIN tenant_rooms tr ON tr.tenant_id = t.id
             JOIN rooms r ON r.id = tr.room_id
             WHERE r.admin_id = $1
             GROUP BY t.id
             ORDER BY t.created_at DESC`,
            [admin_id]
        );

        res.json({ success: true, tenants: result.rows });

    } catch (err) {
        console.error("Error fetching tenants:", err);
        res.status(500).json({ error: "Server error while fetching tenants" });
    }
});

/**
 * Update tenant details + optionally update room prices
 */
router.patch('/:id', verifyToken, async (req, res) => {
    const { id: tenantId } = req.params;
    const { full_name, phone, move_in_date, move_out_date, rooms = [] } = req.body;
    const { id: admin_id } = req.admin;

    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // 1. Update tenant details
        const updateResult = await client.query(
            `UPDATE tenants
             SET full_name = $1, phone = $2, move_in_date = $3, move_out_date = $4
             WHERE id = $5
             RETURNING *`,
            [full_name, phone, move_in_date, move_out_date, tenantId]
        );

        if (updateResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Tenant not found" });
        }

        // 2. Update room prices if sent
        for (const room of rooms) {
            const { id: roomId, price } = room;

            await client.query(
                `UPDATE tenant_rooms
                 SET price = $1
                 WHERE tenant_id = $2 AND room_id = $3`,
                [price, tenantId, roomId]
            );
        }

        await client.query('COMMIT');

        res.status(200).json({
            success: true,
            message: "Tenant updated successfully"
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error updating tenant:", err);
        res.status(500).json({ error: "Something went wrong" });
    } finally {
        client.release();
    }
});

export default router;
