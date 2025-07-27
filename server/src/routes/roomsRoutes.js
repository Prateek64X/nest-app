import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  createRoom,
  getAvailableRooms,
  getRooms,
  getRoomById,
  updateRoomById,
  getRoomsByTenantId,
  deleteRoomById
} from '../controllers/roomsController.js';

const router = express.Router();

router.post('/create', verifyToken, createRoom);
router.get('/', verifyToken, getRooms);
router.get('/:id', verifyToken, getRoomById);
router.get('/by-tenant/:id', verifyToken, getRoomsByTenantId);
router.get('/available', verifyToken, getAvailableRooms);
router.patch('/:id', verifyToken, updateRoomById);
router.delete('/:id', verifyToken, deleteRoomById);

export default router;