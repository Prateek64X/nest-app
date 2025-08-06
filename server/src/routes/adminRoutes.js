// src/routes/adminRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
    checkPassword,
    deleteAdminAccount, 
    getAdminProfile, 
    loginAdmin, 
    registerAdmin, 
    updateAdminProfile
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);
router.get("/profile", verifyToken, getAdminProfile);
router.post("/verify-password", verifyToken, checkPassword);
router.put("/profile", verifyToken, updateAdminProfile);
router.get("/delete", verifyToken, deleteAdminAccount);

export default router;

/// Remove Later - To use the verifyToken code, We need to post like this
// router.get(/tenants/:id, verifyToken, async(req, res) => {
// // Other unprotected routes are called like
// router.post('/register', async (req, res) => {