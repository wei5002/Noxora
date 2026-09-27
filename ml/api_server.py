from pathlib import Path
import json

import pandas as pd
from fastapi import FastAPI, HTTPException
from urllib.request import urlopen
from urllib.parse import urlencode


# FASTAPI APP
app = FastAPI()

# PATH PREDICTION CSV
ML_DIR = Path(__file__).resolve().parent

CSV_PATH = (
    ML_DIR
    / "results"
    / "predictions"
    / "svr_realtime_predictions.csv"
)

# LOCATION CONFIGURATION
LOCATIONS = {
    0: {
        "name": "Jakarta Timur",
        "latitude": -6.221441,
        "longitude": 106.931435,
    },
    1: {
        "name": "Kepulauan Seribu",
        "latitude": -5.7996483,
        "longitude": 106.47254,
    },
    2: {
        "name": "Bekasi",
        "latitude": -6.0808434,
        "longitude": 107.05342,
    },
    3: {
        "name": "Bogor",
        "latitude": -6.5729346,
        "longitude": 106.47356,
    },
    4: {
        "name": "Sukabumi",
        "latitude": -6.6432333,
        "longitude": 106.78992,
    },
    5: {
        "name": "Tangerang",
        "latitude": -6.0808434,
        "longitude": 106.45242,
    },
    6: {
        "name": "Banten Utara",
        "latitude": -5.7293496,
        "longitude": 106.60848,
    },
    7: {
        "name": "Bekasi Timur",
        "latitude": -6.2917395,
        "longitude": 107.17155,
    },
    8: {
        "name": "Karawang",
        "latitude": -6.4323373,
        "longitude": 106.974014,
    },
    9: {
        "name": "Purwakarta",
        "latitude": -6.2917395,
        "longitude": 107.39749,
    },
}

# ENDPOINT: PREDICTIONS
@app.get("/predictions")
def get_predictions():
    if not CSV_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail=f"File tidak ditemukan: {CSV_PATH}",
        )

    try:
        df = pd.read_csv(CSV_PATH)

        # Mengubah NaN menjadi None agar bisa dikirim sebagai JSON
        df = df.astype(object).where(pd.notna(df), None)

        return df.to_dict(orient="records")

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal membaca file prediksi: {error}",
        )

# ENDPOINT: CURRENT WEATHER
@app.get("/current-weather")
def get_current_weather(location_id: int = 1):

    # Cari konfigurasi lokasi berdasarkan ID
    location = LOCATIONS.get(location_id)

    if not location:
        raise HTTPException(
            status_code=404,
            detail="Lokasi tidak ditemukan.",
        )

    latitude = location["latitude"]
    longitude = location["longitude"]

    # Pastikan koordinat sudah diisi
    if latitude is None or longitude is None:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Koordinat untuk {location['name']} "
                "belum dikonfigurasi."
            ),
        )

    # OPEN-METEO WEATHER API
    weather_params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "rain,"
            "wind_speed_10m"
        ),
        "wind_speed_unit": "kmh",
        "timezone": "Asia/Jakarta",
    }

    weather_url = (
        "https://api.open-meteo.com/v1/forecast?"
        + urlencode(weather_params)
    )

    # OPEN-METEO AIR QUALITY API
    air_params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "nitrogen_dioxide",
        "timezone": "Asia/Jakarta",
    }

    air_url = (
         "https://air-quality-api.open-meteo.com/v1/air-quality?"
        + urlencode(air_params)
    )

    try:
        # Ambil data cuaca
        with urlopen(weather_url, timeout=30) as response:
            weather_data = json.loads(
                response.read().decode("utf-8")
            )

        # Ambil data kualitas udara
        with urlopen(air_url, timeout=30) as response:
            air_data = json.loads(
                response.read().decode("utf-8")
            )

        weather = weather_data.get("current", {})
        air = air_data.get("current", {})

        if not weather:
            raise ValueError(
                "Data cuaca terkini tidak tersedia."
            )

        if not air:
            raise ValueError(
                "Data kualitas udara terkini tidak tersedia."
            )

        return {
            "location_id": location_id,
            "location_name": location["name"],
            "time": weather.get("time"),
            "nitrogen_dioxide": air.get("nitrogen_dioxide"),
            "temperature_2m": weather.get("temperature_2m"),
            "wind_speed_10m": weather.get("wind_speed_10m"),
            "rain": weather.get("rain"),
            "relative_humidity_2m": weather.get(
                "relative_humidity_2m"
            ),
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=(
                "Gagal mengambil data dari Open-Meteo: "
                f"{error}"
            ),
        )