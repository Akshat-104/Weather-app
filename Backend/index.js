import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { PrismaClient } from "./generated/prisma/client.ts";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Routes
app.use("/api/auth", authRoutes);

//save city
app.post("/api/history", async (req, res) => {
  const { city, userId } = req.body;
  try {
    const history = await prisma.weatherHistory.create({
      data: { city, userId },
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get history
app.get("/api/history", async (req, res) => {
  const { userId } = req.query;
  const history = await prisma.weatherHistory.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: "desc" },
    select: { id: true, city: true },
  });
  res.json(history);
});

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});