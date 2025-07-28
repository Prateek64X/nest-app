import express from 'express';
import multer from 'multer';
import { createTenant, getTenants, getTenantById, getTenantsByIds, updateTenant, deleteTenant } from '../controllers/tenantsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); 

router.post('/create', verifyToken, upload.any(), createTenant);
router.get('/', verifyToken, getTenants);
router.get("/:id", verifyToken, getTenantById);
router.post("/by-ids", verifyToken, getTenantsByIds);
router.patch('/:id', verifyToken, upload.any(), updateTenant);
router.delete('/:id', verifyToken, deleteTenant);

export default router;