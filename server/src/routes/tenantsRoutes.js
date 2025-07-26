import express from 'express';
import { createTenant, getTenants } from '../controllers/tenantsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', verifyToken, createTenant);
router.get('/', verifyToken, getTenants);
// router.patch('/:id', verifyToken, updateTenant);

export default router;