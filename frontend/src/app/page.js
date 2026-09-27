"use client";

import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCloudSun, FaLocationDot } from "react-icons/fa6";
import {
  InputPrediction,
  MiniCard,
  MiniCardLocation,
} from "../components/Detail/detail";
import { ComboBoxDashboard } from "../components/ComboBox/comboBox";
import PredictionChart from "../components/Grafik/grafik";
import { RiCloudWindyFill } from "react-icons/ri";

export default function Home() {
  const router = useRouter();

  const [predictionData, setPredictionData] = useState(null);
  const [selectedLocation, setSelectedLocation] =
    useState("1");
  const [selectedPredictionLocation, setSelectedPredictionLocation] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allPredictions, setAllPredictions] = useState([]);

  const fetchWeather = async (locationId, targetTime) => {
    try {
      setWeatherLoading(true);
      setWeatherError("");

      const params = new URLSearchParams({
        targetTime: targetTime,
      });

      const url = `http://localhost:5000/api/weather/${locationId}?${params.toString()}`;

      const response = await fetch(url);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil data cuaca.");
      }

      setWeatherInput({
        temperature: data.temperature_2m ?? "",
        windSpeed: data.wind_speed_10m ?? "",
        rain: data.rain ?? "",
        humidity: data.relative_humidity_2m ?? "",
      });

      setWeatherTime(data.weather_time);
    } catch (error) {
      console.error("Fetch weather error:", error);
      setWeatherError(error.message || "Gagal mengambil data cuaca.");
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleSendPrediction = async () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
      alert("Silakan login terlebih dahulu untuk melakukan prediksi.");
      router.push("/Login");
      return;
    }

    // Cek apakah lokasi sudah dipilih
    if (!selectedPredictionLocation) {
      setError("Silakan pilih lokasi terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/predictions");

      if (!response.ok) {
        throw new Error("Gagal mengambil data prediksi.");
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Data prediksi tidak tersedia.");
      }

      setAllPredictions(data);

      // Ambil hasil prediksi sesuai lokasi yang dipilih
      const result = data.find(
        (item) =>
          String(item.location_id) === String(selectedPredictionLocation),
      );

      if (!result) {
        throw new Error(
          "Data prediksi untuk lokasi yang dipilih tidak ditemukan.",
        );
      }

      const targetTime = result.target_time.split(" ")[1].slice(0, 5);

      // 3 nilai NO2 sebelumnya + hasil prediksi
      const chartSeries = [
        Number(result.LAG3),
        Number(result.LAG2),
        Number(result.LAG1),
        Number(result.predicted_nitrogen_dioxide),
      ].map((value) => Number(value.toFixed(2)));

      // Label waktu grafik
      const [hour, minute] = targetTime.split(":").map(Number);
      const targetMinutes = hour * 60 + minute;

      const chartCategories = [-180, -120, -60, 0].map((offset) => {
        const totalMinutes = (targetMinutes + offset + 1440) % 1440;
        const h = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
        const m = String(totalMinutes % 60).padStart(2, "0");

        return `${h}:${m}`;
      });

      setPredictionData({
        location_id: result.location_id,
        target_time: result.target_time,

        // Hasil prediksi
        value: Number(result.predicted_nitrogen_dioxide),
        time: targetTime,
        method: "SVR",

        // Data meteorologi dari API predictions
        temperature_2m: result.temperature_2m,
        wind_speed_10m: result.wind_speed_10m,
        rain: result.rain,
        relative_humidity_2m: result.relative_humidity_2m,

        // Data grafik
        chartSeries,
        chartCategories,
      });
    } catch (error) {
      console.error("Gagal mendapatkan prediksi:", error);
      setError(error.message || "Terjadi kesalahan saat mengambil prediksi.");
      setPredictionData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const target = sessionStorage.getItem("scrollTarget");

    if (target) {
      sessionStorage.removeItem("scrollTarget");

      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, []);

  return (
    <Flex
      direction={"column"}
      w={"100%"}
      bg={"bg.gradient"}
      minH={"100vh"}
      gap={{ base: "0", lg: "3vh" }}
      justify={"center"}
      align={"center"}
    >
      <Flex
        w={"100%"}
        direction={"row"}
        gap={"15vh"}
        justify={"center"}
        py={"4vh"}
      >
        <Flex
          direction={{
            xl: "row",
            lg: "column",
            md: "column",
            sm: "column",
            xs: "column",
            base: "column",
          }}
          mt={{
            xl: "12vh",
            lg: "12vh",
            md: "12vh",
            sm: "16vh",
            xs: "16vh",
            base: "16vh",
          }}
          w={"90%"}
          justify={"center"}
          gap={"3vh"}
        >
          {/* Current Weather */}
          <Flex
            w={{
              xl: "50%",
              lg: "100%",
              md: "100%",
              sm: "100%",
              xs: "100%",
              base: "100%",
            }}
            gap={"2vh"}
            direction={"column"}
          >
            <Flex
              w={"100%"}
              p={"2.5vh"}
              borderRadius={"2vh"}
              bg={"bg.secondary"}
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
              direction={"column"}
              gap={"2vh"}
              h={"100%"}
              justify={"space-between"}
            >
              <Flex direction={"column"}>
                <Flex justify={"space-between"}>
                  <Text fontSize={"sm"} color={"text.thrid"}>
                    Current Weather
                  </Text>

                  <Flex
                    w={"30vh"}
                    direction={"row"}
                    gap={"1vh"}
                    align={"center"}
                  >
                    <FaLocationDot />
                    <ComboBoxDashboard
                      value={selectedLocation}
                      onValueChange={setSelectedLocation}
                    />
                  </Flex>
                </Flex>

                <Text fontWeight={"bold"}>12.59</Text>
              </Flex>

              <Flex direction={"row"} gap={"2vh"} align={"center"}>
                <FaCloudSun size={"8vh"} />
                <Text fontSize={"xl"}>26.7 μg/m³</Text>
              </Flex>

              <Text fontSize={"sm"}>
                Ini jarak antar waktu kemarin naik/turun berapa
              </Text>
            </Flex>

            <Grid
              w="100%"
              templateColumns={{
                base: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              }}
              gap="2vh"
            >
              <MiniCard title="Location" hasil="Jakarta" />
              <MiniCard title="Nitrogen Dioxide" hasil="26.7 μg/m³" />
              <MiniCard title="Temperature" hasil="22.6 °C" />
              <MiniCard title="Wind Speed" hasil="8.9 km/h" />
              <MiniCard title="Rain" hasil="0 mm" />
              <MiniCard title="Relative Humidity" hasil="96%" />
            </Grid>

            <Flex
              w={"100%"}
              gap={"2vh"}
              direction={{
                xl: "row",
                lg: "row",
                md: "row",
                sm: "column",
                xs: "column",
                base: "column",
              }}
            >
              <Flex w={"100%"} direction={"row"} gap={"2vh"}>
                <MiniCardLocation location={"Jakarta"} hasil={"26.7"} />
                <MiniCardLocation location={"Bogor"} hasil={"26.7"} />
              </Flex>

              <Flex w={"100%"} direction={"row"} gap={"2vh"}>
                <MiniCardLocation location={"Depok"} hasil={"26.7"} />
                <MiniCardLocation location={"Tangerang"} hasil={"26.7"} />
              </Flex>
            </Flex>
          </Flex>

          {/* Prediction */}
          <Flex
            w={{
              xl: "50%",
              lg: "100%",
              md: "100%",
              sm: "100%",
              xs: "100%",
              base: "100%",
            }}
            direction={"column"}
            gap={"2vh"}
          >
            <Flex
              p={"2.5vh"}
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
              borderRadius={"2vh"}
              bg={"bg.secondary"}
              gap={"2vh"}
              direction={"column"}
            >
              <Flex pb={"0.5vh"} borderBottom={"1px solid #dfdddd"}>
                <Text fontWeight={"bold"} color={"text.fouth"}>
                  Prediction Nitrogen Dioxide
                </Text>
              </Flex>

              <Flex
                direction={{ base: "column", md: "row" }}
                gap={"2vh"}
                justify={"space-between"}
              >
                <Flex direction={"column"} w={{ base: "100%", md: "45%" }}>
                  <Text w={"20vh"} fontSize={"sm"} fontWeight={"bold"}>
                    Location
                  </Text>

                  <ComboBoxDashboard
                    w={"100%"}
                    value={selectedPredictionLocation}
                    onValueChange={setSelectedPredictionLocation}
                  />
                </Flex>

                <Flex w="100%" gap="2vh">
                  <InputPrediction
                    title="Temperature"
                    placeholder="Temperature..."
                    value={
                      predictionData?.temperature_2m != null
                        ? Number(predictionData.temperature_2m).toFixed(2)
                        : "-"
                    }
                    satuan="°C"
                  />

                  <InputPrediction
                    title="Wind Speed"
                    placeholder="Wind Speed..."
                    value={
                      predictionData?.wind_speed_10m != null
                        ? Number(predictionData.wind_speed_10m).toFixed(2)
                        : "-"
                    }
                    satuan="km/h"
                  />
                </Flex>
              </Flex>

              <Flex direction={"row"} gap={"2vh"} justify={"space-between"}>
                <InputPrediction
                  title="Rain"
                  placeholder="Rain..."
                  value={
                    predictionData?.rain != null
                      ? Number(predictionData.rain).toFixed(2)
                      : "-"
                  }
                  satuan="mm"
                />
                <InputPrediction
                  title="Relative Humidity"
                  placeholder="Relative Humidity..."
                  value={
                    predictionData?.relative_humidity_2m != null
                      ? Number(predictionData.relative_humidity_2m).toFixed(2)
                      : "-"
                  }
                  satuan="%"
                />
              </Flex>

              <Flex
                justify={"center"}
                align={"center"}
                direction={"column"}
                gap={"1vh"}
              >
                <Button
                  w={"15vh"}
                  h={"4.5vh"}
                  borderRadius={"4vh"}
                  bg={"button.primary"}
                  onClick={handleSendPrediction}
                  isLoading={loading}
                  _hover={{ bg: "hover.primary" }}
                >
                  Send
                </Button>

                {error && (
                  <Text color="red.500" fontSize="sm" textAlign="center">
                    {error}
                  </Text>
                )}
              </Flex>
            </Flex>

            {/* Prediction Chart dan Result */}
            <Flex
              h="40vh"
              w={"100%"}
              gap={"2vh"}
              direction={{ base: "column", md: "row" }}
            >
              <PredictionChart data={predictionData} />

              <Flex
                h={"100%"}
                w={{ base: "100%", md: "42%" }}
                direction="column"
                p={"2.5vh"}
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
                borderRadius={"2vh"}
                bg={"bg.secondary"}
                gap={"2vh"}
              >
                <Flex pb={"0.5vh"} borderBottom={"1px solid #dfdddd"}>
                  <Text fontWeight={"bold"} color={"text.fouth"}>
                    Prediction Result
                  </Text>
                </Flex>

                <Flex
                  w={"100%"}
                  direction={"column"}
                  gap={"1vh"}
                  justify={"space-between"}
                >
                  <Text fontSize={"sm"} color={"text.thrid"}>
                    Prediksi Berikut:
                  </Text>

                  <Flex
                    direction={"row"}
                    gap={"2vh"}
                    align={"center"}
                    justify={"center"}
                  >
                    <Text
                      fontSize={"5xl"}
                      fontWeight={"bold"}
                      color={"text.fouth"}
                    >
                      {predictionData
                        ? Number(predictionData.value).toFixed(2)
                        : "-"}
                    </Text>

                    {predictionData && (
                      <Text fontSize={"sm"} color={"text.thrid"}>
                        μg/m³
                      </Text>
                    )}
                  </Flex>

                  <Flex w={"100%"} direction={"row"} gap={"2vh"} mt={"1.5vh"}>
                    <Flex
                      w={"50%"}
                      bg={"card.primary"}
                      p={"1.5vh"}
                      borderRadius={"2vh"}
                    >
                      <Flex
                        w={"100%"}
                        justify={"center"}
                        align={"center"}
                        gap={"1vh"}
                        direction={"column"}
                      >
                        <Text
                          fontSize={"2xs"}
                          textAlign={"center"}
                          fontWeight={"bold"}
                        >
                          Waktu Prediksi
                        </Text>

                        <Text
                          textAlign={"center"}
                          fontSize={"xl"}
                          fontWeight={"bold"}
                          color={"text.thrid"}
                        >
                          {predictionData ? predictionData.time : "-"}
                        </Text>
                      </Flex>
                    </Flex>

                    <Flex
                      w={"50%"}
                      bg={"card.primary"}
                      p={"1.5vh"}
                      borderRadius={"2vh"}
                    >
                      <Flex
                        w={"100%"}
                        h={"100%"}
                        justify={"center"}
                        direction={"column"}
                        gap={"1vh"}
                        align={"center"}
                      >
                        <Text
                          fontSize={"2xs"}
                          textAlign={"center"}
                          fontWeight={"bold"}
                        >
                          Metode Prediksi
                        </Text>

                        <Text
                          textAlign={"center"}
                          fontSize={"lg"}
                          fontWeight={"bold"}
                          color={"text.thrid"}
                        >
                          {predictionData ? predictionData.method : "-"}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {/* About Noxora */}
      <Flex
        w={{ base: "90%", lg: "60%" }}
        py={"4vh"}
        px={"4vh"}
        gap={{ base: "1vh", md: "3vh" }}
        bg={"bg.secondary"}
        direction={{ base: "column", md: "row" }}
        borderRadius={"2vh"}
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
      >
        <Flex
          w={{ base: "100%", lg: "65%" }}
          direction={"column"}
          gap={"1.5vh"}
        >
          <Text
            fontSize={"xl"}
            fontWeight={"bold"}
            textAlign={{ base: "center", md: "start" }}
          >
            Noxora
          </Text>

          <Text fontSize={"md"} textAlign={"justify"} color={"text.thrid"}>
            Noxora adalah aplikasi berbasis Progressive Web App (PWA) yang
            membantu pengguna memprediksi konsentrasi nitrogen dioksida (NO₂)
            dan memantau kualitas udara di wilayah Jabodetabek. Aplikasi ini
            menggunakan algoritma XGBoost dan Support Vector Regression (SVR)
            untuk menghasilkan prediksi konsentrasi NO₂ berdasarkan kondisi
            lingkungan.
          </Text>

          <Text fontSize={"md"} textAlign={"justify"} color={"text.thrid"}>
            Pengguna dapat memasukkan parameter lingkungan seperti lokasi,
            temperatur, kecepatan angin, curah hujan, dan kelembapan relatif.
            Hasil prediksi kemudian ditampilkan dalam bentuk nilai konsentrasi
            NO₂ dan grafik sehingga lebih mudah dipahami.
          </Text>
        </Flex>

        <Flex
          w={{ base: "100%", md: "35%" }}
          direction={"column"}
          gap={"1.5vh"}
          align={"center"}
          justify={"center"}
        >
          <RiCloudWindyFill size={"30vh"} />
        </Flex>
      </Flex>

      {/* Footer */}
      <Flex
        w={"100%"}
        mt={"4vh"}
        py={"3vh"}
        px={"6vh"}
        bg={"bg.secondary"}
        direction={"column"}
        align={"center"}
        gap={"1vh"}
        borderTop={"1px solid #e7e7e7"}
      >
        <Text fontSize={"xl"} fontWeight={"bold"} color={"text.fouth"}>
          Noxora
        </Text>

        <Text fontSize={"sm"} color={"text.thrid"} textAlign={"center"}>
          Prediksi Konsentrasi Nitrogen Dioksida (NO₂)
          <br />
          Menggunakan XGBoost dan Support Vector Regression
        </Text>

        <Text fontSize={"xs"} color={"text.thrid"} mt={"1vh"}>
          © 2026 Shirley 535230024. All rights reserved.
        </Text>
      </Flex>
    </Flex>
  );
}
