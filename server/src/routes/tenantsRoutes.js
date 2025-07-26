import express from 'express';
import { createTenant, getTenants, getTenantById, getTenantsByIds, updateTenant } from '../controllers/tenantsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', verifyToken, createTenant);
router.get('/', verifyToken, getTenants);
router.get("/:id", verifyToken, getTenantById);
router.post("/by-ids", verifyToken, getTenantsByIds);
router.patch('/:id', verifyToken, updateTenant);

export default router;