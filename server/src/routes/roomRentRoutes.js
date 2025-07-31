import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { createRoomRentEntries, getRoomRents, getUpcomingRoomRents, updateRoomRent } from '../controllers/roomRentController.js';

const router = express.Router();

// Here add routes
router.get('/', verifyToken, getRoomRents);
router.get('/upcoming', verifyToken, getUpcomingRoomRents);
router.patch('/:id', verifyToken, updateRoomRent);

export default router;