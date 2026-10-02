import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js";

import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import fs from "fs";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// PATH
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// backend/.. = Noxora
// lalu masuk ke ml
const ML_DIR = path.join(__dirname, "..", "ml");
const REALTIME_CSV = path.join(ML_DIR, "data", "api", "realtime_api.csv");
const PREDICTION_CSV = path.join(
  ML_DIR,
  "results",
  "predictions",
  "svr_realtime_predictions.csv",
);

// MIDDLEWARE
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

// MENJALANKAN PYTHON
function runPythonScript(filename) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(ML_DIR, "prediction", filename);
    const python = spawn("python", [scriptPath], {
      cwd: ML_DIR,
      shell: false,
    });

    python.stdout.on("data", (data) => {
      process.stdout.write(`[${filename}] ${data}`);
    });

    python.stderr.on("data", (data) => {
      process.stderr.write(`[${filename}] ${data}`);
    });

    python.on("error", (error) => {
      console.error(`${filename} gagal dijalankan.`);

      console.error(error);

      reject(error);
    });

    python.on("close", (code) => {
      if (code === 0) {
        console.log(`${filename} selesai dijalankan.`);

        resolve();
      } else {
        const error = new Error(`${filename} gagal dijalankan.`);

        console.error(error.message);

        reject(error);
      }
    });
  });
}

// ML PIPELINE
async function runMLPipeline() {
  try {
    await runPythonScript("fetch_hourly_api.py");
    await runPythonScript("fetch_realtime_api.py");
    await runPythonScript("predict_realtime.py");
  } catch (error) {
    console.error(error.message);
  }
}

// MEMBACA FILE CSV
function readCSV(filePath) {
  const csv = fs.readFileSync(filePath, "utf8");
  const lines = csv
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  const headers = lines[0].split(",").map((header) => header.trim());
  const data = lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    return row;
  });
  return data;
}

// REALTIME ALL
app.get("/api/realtime-all", async (req, res) => {
  try {
    if (!fs.existsSync(REALTIME_CSV)) {
      return res.status(404).json({
        message: "Data realtime belum tersedia.",
      });
    }

    const data = readCSV(REALTIME_CSV);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal membaca data realtime.",
    });
  }
});

// REALTIME BERDASARKAN LOCATION
app.get("/api/realtime", async (req, res) => {
  try {
    const locationId = Number(req.query.location_id);
    const predict = req.query.predict === "true";

    if (!locationId) {
      return res.status(400).json({
        message: "location_id wajib diisi.",
      });
    }

    // JIKA MEMINTA DATA PREDIKSI
    if (predict) {
      if (!fs.existsSync(PREDICTION_CSV)) {
        return res.status(404).json({
          message: "Data prediksi belum tersedia.",
        });
      }

      const data = readCSV(PREDICTION_CSV);

      const result = data.find(
        (item) => Number(item.location_id) === locationId,
      );

      if (!result) {
        return res.status(404).json({
          message: "Data prediksi untuk lokasi tidak ditemukan.",
        });
      }

      return res.json(result);
    }

    // JIKA MEMINTA DATA REALTIME
    if (!fs.existsSync(REALTIME_CSV)) {
      return res.status(404).json({
        message: "Data realtime belum tersedia.",
      });
    }

    const data = readCSV(REALTIME_CSV);
    const result = data.find((item) => Number(item.location_id) === locationId);

    if (!result) {
      return res.status(404).json({
        message: "Data realtime untuk lokasi tidak ditemukan.",
      });
    }

    return res.json(result);
  } catch (error) {
    console.error("Gagal mengambil data realtime/prediksi:", error);

    return res.status(500).json({
      message: "Gagal mengambil data realtime/prediksi.",
    });
  }
});

// PREDICTIONS
app.get("/api/predictions", async (req, res) => {
  try {
    if (!fs.existsSync(PREDICTION_CSV)) {
      return res.status(404).json({
        message: "Data prediksi belum tersedia.",
      });
    }

    const data = readCSV(PREDICTION_CSV);

    return res.json(data);
  } catch (error) {
    console.error("Gagal membaca data prediksi:", error);

    return res.status(500).json({
      message: "Gagal membaca data prediksi.",
    });
  }
});

// ROUTES
app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", passwordRoutes);

// START SERVER
app.listen(PORT, async () => {
  console.log(`Backend berjalan di http://localhost:${PORT}`);
  await runMLPipeline();
});
