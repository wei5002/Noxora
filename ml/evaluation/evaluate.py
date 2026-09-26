import pandas as pd
import numpy as np

from pathlib import Path
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)


# PATH
BASE_DIR = Path(__file__).resolve().parents[1]

PREDICTION_DIR = (
    BASE_DIR / "results" / "predictions"
)

EVALUATION_DIR = (
    BASE_DIR / "results" / "evaluation"
)

EVALUATION_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# KOLOM YANG DIBUTUHKAN
REQUIRED_COLUMNS = [
    "actual",
    "predicted",
    "algorithm",
    "dataset",
    "split",
]


# LOAD HASIL PREDIKSI
def load_predictions():

    if not PREDICTION_DIR.exists():
        raise FileNotFoundError(
            f"Folder prediksi tidak ditemukan: "
            f"{PREDICTION_DIR}"
        )

    prediction_files = sorted(
        PREDICTION_DIR.glob("*_predictions.csv")
    )

    if not prediction_files:
        raise FileNotFoundError(
            "Tidak ada file prediksi. "
            "Jalankan training terlebih dahulu."
        )

    dataframes = []

    for file_path in prediction_files:

        # print(f"Membaca: {file_path.name}")

        df = pd.read_csv(file_path)

        missing_columns = [
            col
            for col in REQUIRED_COLUMNS
            if col not in df.columns
        ]

        if missing_columns:
            raise ValueError(
                f"Kolom tidak ditemukan pada "
                f"{file_path.name}: {missing_columns}"
            )

        # Pastikan nilai aktual dan prediksi numerik
        df["actual"] = pd.to_numeric(
            df["actual"],
            errors="coerce",
        )

        df["predicted"] = pd.to_numeric(
            df["predicted"],
            errors="coerce",
        )

        # Hapus nilai kosong dan tak hingga
        df = df.replace(
            [np.inf, -np.inf],
            np.nan,
        )

        df = df.dropna(
            subset=REQUIRED_COLUMNS
        )

        if not df.empty:
            dataframes.append(df)

    if not dataframes:
        raise ValueError(
            "Tidak ada data prediksi valid untuk dievaluasi."
        )

    return pd.concat(
        dataframes,
        ignore_index=True,
    )


# HITUNG METRIK EVALUASI
def evaluate_model(actual, predicted):

    mae = mean_absolute_error(
        actual,
        predicted,
    )

    mse = mean_squared_error(
        actual,
        predicted,
    )

    rmse = np.sqrt(mse)

    # R² memerlukan minimal dua data
    if len(actual) >= 2:
        r2 = r2_score(
            actual,
            predicted,
        )
    else:
        r2 = np.nan

    return {
        "MAE": mae,
        "MSE": mse,
        "RMSE": rmse,
        "R2": r2,
    }


# EVALUASI SELURUH EKSPERIMEN
def run_evaluation():

    predictions = load_predictions()

    results = []

    grouped = predictions.groupby(
        [
            "algorithm",
            "dataset",
            "split",
        ],
        dropna=False,
    )

    for (
        algorithm,
        dataset,
        split,
    ), group in grouped:

        actual = group["actual"].to_numpy()
        predicted = group["predicted"].to_numpy()

        metrics = evaluate_model(
            actual,
            predicted,
        )

        result = {
            "algorithm": algorithm,
            "dataset": dataset,
            "split": split,
            "total_data": len(group),
            **metrics,
        }

        results.append(result)

    results_df = pd.DataFrame(results)

    # URUTKAN HASIL BERDASARKAN RMSE
    results_df = results_df.sort_values(
        ["split", "RMSE", "MAE"],
        ascending=[True, True, True],
    ).reset_index(drop=True)

    # TAMBAHKAN PERINGKAT BERDASARKAN RMSE
    results_df["rank_rmse"] = (
        results_df.groupby("split")["RMSE"]
        .rank(method="min", ascending=True)
        .astype(int)
    )

    # TAMPILKAN HASIL TERBAIK SETIAP SPLIT
    # print("HASIL EKSPERIMEN TERBAIK")

    for split_name in ["70_30", "80_20"]:

        split_results = results_df[
            results_df["split"] == split_name
        ].sort_values("RMSE")

        if split_results.empty:
            print(
                f"\nTidak ada hasil untuk split {split_name}."
            )
            continue

        best = split_results.iloc[0]

        print(
            f"\nPembagian data: "
            f"{split_name.replace('_', ':')}"
        )

        print(f"Algoritma      : {best['algorithm']}")
        print(f"Dataset        : {best['dataset']}")
        print(f"Jumlah data    : {best['total_data']}")
        print(f"RMSE           : {best['RMSE']:.6f}")
        print(f"MAE            : {best['MAE']:.6f}")
        print(f"MSE            : {best['MSE']:.6f}")
        print(f"R²             : {best['R2']:.6f}")

        print("\nUrutan eksperimen berdasarkan RMSE:")

        for _, row in split_results.iterrows():

            print(
                f"{row['rank_rmse']}. "
                f"{row['algorithm']} | "
                f"{row['dataset']} | "
                f"RMSE: {row['RMSE']:.6f} | "
                f"MAE: {row['MAE']:.6f} | "
                f"R²: {row['R2']:.6f}"
            )

    # SIMPAN HASIL EVALUASI
    output_path = (
        EVALUATION_DIR
        / "evaluation_results.csv"
    )

    results_df.to_csv(
        output_path,
        index=False,
    )
    print("")

    # TAMPILKAN SELURUH HASIL
    print("HASIL EVALUASI SELURUH MODEL")

    print(
        results_df.to_string(
            index=False,
            float_format=lambda value: f"{value:.6f}",
        )
    )

   
    print("")

    return results_df


# MAIN
if __name__ == "__main__":
    run_evaluation()