import requests
import pandas as pd

from pathlib import Path
from datetime import datetime


# 1. KONFIGURASI LOKASI
LATITUDES = [
    -6.199997,
    -5.7986665,
    -6.002,
    -6.5999985,
    -6.656,
    -6.0606,
    -5.745,
    -6.319,
    -6.402,
    -6.2999954,
]

LONGITUDES = [
    106.899994,
    106.4990656,
    107.002,
    106.5,
    106.844,
    106.4242,
    106.613,
    107.163,
    106.97,
    107.399994,
]


# 2. URL API
AIR_QUALITY_URL = (
    "https://air-quality-api.open-meteo.com/v1/air-quality"
)

WEATHER_URL = (
    "https://api.open-meteo.com/v1/forecast"
)


# 3. FUNGSI MENGAMBIL DATA API
def fetch_api(url, params):
    response = requests.get(
        url,
        params=params,
        timeout=60
    )

    response.raise_for_status()

    return response.json()


# 4. AMBIL DATA NO2 TERKINI
def fetch_no2():
    params = {
        "latitude": ",".join(map(str, LATITUDES)),
        "longitude": ",".join(map(str, LONGITUDES)),
        "current": "nitrogen_dioxide",
        "timezone": "Asia/Jakarta",
    }

    data = fetch_api(AIR_QUALITY_URL, params)

    # Jika banyak koordinat, respons dapat berupa list.
    if isinstance(data, dict):
        data = [data]

    rows = []

    for i, item in enumerate(data):
        current = item.get("current", {})

        rows.append({
            "location_id": i + 1,
            "time_no2": current.get("time"),
            "nitrogen_dioxide": current.get(
                "nitrogen_dioxide"
            ),
        })

    return pd.DataFrame(rows)


# 5. AMBIL DATA METEOROLOGI TERKINI
def fetch_weather():
    params = {
        "latitude": ",".join(map(str, LATITUDES)),
        "longitude": ",".join(map(str, LONGITUDES)),
        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "rain,"
            "wind_speed_10m"
        ),
        "timezone": "Asia/Jakarta",
    }

    data = fetch_api(WEATHER_URL, params)

    if isinstance(data, dict):
        data = [data]

    rows = []

    for i, item in enumerate(data):
        current = item.get("current", {})

        rows.append({
            "location_id": i + 1,
            "time_weather": current.get("time"),
            "temperature_2m": current.get(
                "temperature_2m"
            ),
            "relative_humidity_2m": current.get(
                "relative_humidity_2m"
            ),
            "rain": current.get("rain"),
            "wind_speed_10m": current.get(
                "wind_speed_10m"
            ),
        })

    return pd.DataFrame(rows)


# 6. JALANKAN PENGAMBILAN DATA
def main():
    print("Mengambil data NO2 dari Open-Meteo...")

    df_no2 = fetch_no2()

    print("Mengambil data meteorologi...")

    df_weather = fetch_weather()

    # Gabungkan berdasarkan ID lokasi.
    df = pd.merge(
        df_no2,
        df_weather,
        on="location_id",
        how="inner"
    )

    # Simpan CSV secara otomatis.
    ml_dir = Path(__file__).resolve().parents[1]

    output_dir = ml_dir / "data" / "api"
    output_dir.mkdir(parents=True, exist_ok=True)

    output_file = output_dir / "realtime_api.csv"

    df.to_csv(output_file, index=False)

    print("\nPengambilan data selesai!")
    print(f"Jumlah lokasi: {len(df)}")
    print(f"File tersimpan di: {output_file}")

    print("\nData API:")
    print(df.to_string(index=False))


if __name__ == "__main__":
    try:
        main()
    except requests.RequestException as error:
        print(f"Gagal mengambil data dari API: {error}")
    except (KeyError, TypeError, ValueError) as error:
        print(f"Terjadi kesalahan saat memproses data: {error}")