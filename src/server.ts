import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDatabase from "./config/database";
import automationRoutes from "./routes/automationRoutes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());
app.use(express.json());

// ============================================================
// ROOT
// ============================================================

app.get("/", (_req, res) => {
  res.json({
    name: "Automation Backend",
    status: "running",
    message: "Backend API is running successfully",
  });
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// AUTOMATION ROUTES
// ============================================================

app.use("/api/automation", automationRoutes);

// ============================================================
// START SERVER
// ============================================================

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
};

startServer();