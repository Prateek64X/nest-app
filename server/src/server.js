import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { createRoomRentEntries } from "./controllers/roomRentController.js";
import cron from "node-cron";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

// Cron jobs
let frequencyMonth = "0 0 1 * *";
// let frequencyTest = "* * * * *";
cron.schedule(frequencyMonth, async () => {
    try {
        await createRoomRentEntries();
        console.log("Cron: rent entries created successfully.");
    } catch(err) {
        console.error("Cron failed: Rent creation task:", err)
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});