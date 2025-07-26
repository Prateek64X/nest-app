// src/routes/adminRoutes.js
import express from 'express';
import { loginAdmin, registerAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

export default router;

/// Remove Later - To use the verifyToken code, We need to post like this
// router.get(/tenants/:id, verifyToken, async(req, res) => {
// // Other unprotected routes are called like
// router.post('/register', async (req, res) => {