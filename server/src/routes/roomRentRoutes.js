import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getRoomRents, updateRoomRent } from '../controllers/roomRentController.js';

const router = express.Router();

// Here add routes
router.get('/', verifyToken, getRoomRents);
router.patch('/:id', verifyToken, updateRoomRent);

export default router;