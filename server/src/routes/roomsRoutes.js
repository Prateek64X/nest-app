import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  createRoom,
  getAvailableRooms,
  getRooms,
  updateRoomById
} from '../controllers/roomsController.js';

const router = express.Router();

router.post('/create', verifyToken, createRoom);
router.get('/', verifyToken, getRooms);
router.get('/available', verifyToken, getAvailableRooms);
router.patch('/:id', verifyToken, updateRoomById);

export default router;