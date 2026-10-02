import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// TEST BACKEND
app.get("/", (req, res) => {
  res.json({
    message: "Backend Noxora berhasil berjalan!",
  });
});

// TEST DATABASE
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database berhasil terhubung!",
      time: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database gagal terhubung",
    });
  }
});

// REALTIME (proxy ke FastAPI)
const FASTAPI = "http://127.0.0.1:8000";

async function proxy(path, req, res) {
  try {
    const qs = new URLSearchParams(req.query).toString();
    const response = await fetch(`${FASTAPI}${path}${qs ? `?${qs}` : ""}`);
    const body = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: body.detail || "Gagal mengambil data dari FastAPI",
      });
    }
    res.json(body);
  } catch (error) {
    console.error("Gagal terhubung ke FastAPI:", error);

    res.status(500).json({
      message: "FastAPI tidak dapat diakses",
    });
  }
}

app.get("/api/realtime", (req, res) => proxy("/realtime", req, res));
app.get("/api/realtime-all", (req, res) => proxy("/realtime-all", req, res));

// ROUTES
app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", passwordRoutes);

// MENJALANKAN SERVER
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
