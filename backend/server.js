import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";

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

app.get("/api/predictions", async (req, res) => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/predictions"
    );

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Gagal mengambil data prediksi dari FastAPI",
      });
    }

    const predictions = await response.json();

    res.json(predictions);
  } catch (error) {
    console.error("Gagal terhubung ke FastAPI:", error);

    res.status(500).json({
      message: "FastAPI tidak dapat diakses",
    });
  }
});


// ROUTES
app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", passwordRoutes);
app.use("/api/weather", weatherRoutes);

// MENJALANKAN SERVER
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
