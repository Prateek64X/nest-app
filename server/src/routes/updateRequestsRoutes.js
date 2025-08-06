import { verifyToken } from '../middleware/auth.js';
import express from "express";
import {
  createUpdateRequest,
  updateUpdateRequest,
  getAllUpdateRequests,
  getUpdateRequestTenant
} from "../controllers/updateRequestsController.js";

const router = express.Router();

// Here add routes
router.post("/", verifyToken, createUpdateRequest);
router.patch("/:id", verifyToken, updateUpdateRequest);
router.get("/admin/:adminId", verifyToken, getAllUpdateRequests);
router.get("/tenant/:tenantId", verifyToken, getUpdateRequestTenant);

export default router;