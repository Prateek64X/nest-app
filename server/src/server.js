import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { createRoomRentEntries } from "./controllers/roomRentController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});