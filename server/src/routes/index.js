import express from "express";
import adminRoutes from "./adminRoutes.js";
import roomsRoutes from "./roomsRoutes.js";
import tenantsRoutes from "./tenantsRoutes.js";

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/rooms", roomsRoutes);
router.use("/tenants", tenantsRoutes);

// Example route
router.get("/status", (req, res) => {
    res.json({ message: "API is working fine!" });
});

export default router;