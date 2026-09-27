import express from "express";

const router = express.Router();

const LOCATIONS = {
  // Sesuaikan koordinat dan ID dengan ComboBoxDashboard kamu.
  1: {
    name: "Jakarta",
    latitude: -6.2,
    longitude: 106.9,
  },
};

router.get("/:locationId", async (req, res) => {
  console.log("WEATHER ROUTE DIPANGGIL");
  console.log("URL:", req.originalUrl);
  console.log("Location ID:", req.params.locationId);
  console.log("Target time:", req.query.targetTime);
  try {
    const { locationId } = req.params;
    const { targetTime } = req.query;

    const location = LOCATIONS[locationId];

    if (!location) {
      return res.status(404).json({
        message: "Lokasi tidak ditemukan.",
      });
    }

    if (
      typeof targetTime !== "string" ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:00$/.test(targetTime)
    ) {
      return res.status(400).json({
        message: "targetTime harus berformat YYYY-MM-DDTHH:00.",
      });
    }

    // Waktu cuaca = 1 jam sebelum waktu prediksi.
    const [date, time] = targetTime.split("T");
    const [year, month, day] = date.split("-").map(Number);
    const [hour] = time.split(":").map(Number);

    // Gunakan UTC untuk perhitungan selisih jam agar tidak
    // bergantung pada zona waktu server.
    const targetDate = new Date(Date.UTC(year, month - 1, day, hour));

    targetDate.setUTCHours(targetDate.getUTCHours() - 1);

    // Format waktu lokal Jakarta untuk mencocokkan Open-Meteo.
    const weatherTime = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .format(targetDate)
      .replace(" ", "T");

    const url = new URL("https://api.open-meteo.com/v1/forecast");

    url.search = new URLSearchParams({
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      hourly: [
        "temperature_2m",
        "wind_speed_10m",
        "rain",
        "relative_humidity_2m",
      ].join(","),
      timezone: "Asia/Jakarta",
      past_days: "1",
      forecast_days: "2",
      wind_speed_unit: "kmh",
    }).toString();

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Gagal mengambil data Open-Meteo.");
    }

    const data = await response.json();

    const index = data.hourly.time.indexOf(weatherTime);

    if (index === -1) {
      return res.status(404).json({
        message: `Data cuaca ${weatherTime} tidak tersedia.`,
      });
    }

    res.json({
      location_id: String(locationId),
      location: location.name,
      target_time: targetTime,
      weather_time: weatherTime,
      temperature_2m: data.hourly.temperature_2m[index],
      wind_speed_10m: data.hourly.wind_speed_10m[index],
      rain: data.hourly.rain[index],
      relative_humidity_2m: data.hourly.relative_humidity_2m[index],
    });
  } catch (error) {
    console.error("Weather error:", error);

    res.status(500).json({
      message: "Gagal mengambil data cuaca.",
    });
  }
});

export default router;
