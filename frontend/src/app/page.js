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
  const [selectedLocation, setSelectedLocation] = useState("1");
  const [selectedPredictionLocation, setSelectedPredictionLocation] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentLocationData, setCurrentLocationData] = useState(null);
  const [allLocations, setAllLocations] = useState([]);

  const locationNames = {
    1: "Jakarta Timur",
    2: "Kepulauan Seribu",
    3: "Bekasi",
    4: "Bogor",
    5: "Sukabumi",
    6: "Tangerang",
    7: "Banten Utara",
    8: "Bekasi Timur",
    9: "Karawang",
    10: "Purwakarta",
  };

  const getLocationNO2 = (locationId) => {
    const item = allLocations.find(
      (row) => String(row.location_id) === String(locationId),
    );

    return item?.nitrogen_dioxide != null
      ? Number(item.nitrogen_dioxide).toFixed(2)
      : "-";
  };

  const handleSendPrediction = async () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
      alert("Silakan login terlebih dahulu untuk melakukan prediksi.");
      router.push("/Login");
      return;
    }

    if (!selectedPredictionLocation) {
      setError("Silakan pilih lokasi terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/realtime?location_id=${selectedPredictionLocation}&predict=true`,
      );

      const result = await response.json();
      // console.log("HASIL PREDIKSI DARI BACKEND:", result);

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data prediksi.");
      }

      const predictedNO2 = Number(result.predicted_nitrogen_dioxide);

      if (
        result.predicted_nitrogen_dioxide == null ||
        Number.isNaN(predictedNO2)
      ) {
        throw new Error("Data prediksi tidak tersedia.");
      }

      const targetTimeValue = String(result.target_time || "");

      const targetTime = targetTimeValue.includes("T")
        ? targetTimeValue.split("T")[1]?.slice(0, 5)
        : targetTimeValue.split(" ")[1]?.slice(0, 5);

      if (!targetTime) {
        throw new Error("Waktu prediksi tidak tersedia.");
      }

      // DATA GRAFIK
      const chartSeries = [
        Number(result.LAG3),
        Number(result.LAG2),
        Number(result.LAG1),
        predictedNO2,
      ].map((value) => Number(value.toFixed(2)));

      // WAKTU GRAFIK
      const [hour, minute] = targetTime.split(":").map(Number);
      const targetMinutes = hour * 60 + minute;
      const chartCategories = [-180, -120, -60, 0].map((offset) => {
        const totalMinutes = (targetMinutes + offset + 1440) % 1440;
        const h = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
        const m = String(totalMinutes % 60).padStart(2, "0");
        return `${h}:${m}`;
      });

      // SIMPAN HASIL PREDIKSI
      setPredictionData({
        location_id: result.location_id,
        target_time: result.target_time,
        value: predictedNO2,
        time: targetTime,
        method: "SVR",
        temperature_2m: result.temperature_2m,
        wind_speed_10m: result.wind_speed_10m,
        rain: result.rain,
        relative_humidity_2m: result.relative_humidity_2m,
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

  // Data realtime untuk lokasi yang dipilih di kartu "Current Weather"
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/realtime?location_id=${selectedLocation}`,
        );

        if (!res.ok) throw new Error("Gagal mengambil data realtime.");

        const data = await res.json();

        console.log("DATA CURRENT WEATHER:", data);

        setCurrentLocationData(data);
      } catch (err) {
        console.error(err);
        setCurrentLocationData(null);
      }
    };
    load();
    const timer = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [selectedLocation]);

  // Data realtime semua lokasi untuk kartu kecil
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/realtime-all");
        if (!res.ok) return;
        const data = await res.json();
        setAllLocations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
    const timer = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(timer);
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

                <Text fontWeight="bold">
                  {new Date().toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Asia/Jakarta",
                  })}
                </Text>
              </Flex>

              <Flex direction={"row"} gap={"2vh"} align={"center"}>
                <FaCloudSun size={"8vh"} />
                <Text fontSize="xl">
                  {currentLocationData?.nitrogen_dioxide != null
                    ? `${Number(currentLocationData.nitrogen_dioxide).toFixed(2)} μg/m³`
                    : "-"}
                </Text>
              </Flex>

              <Text fontSize="sm">
                Data aktual terakhir: {currentLocationData?.time_no2 ?? "-"}
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
              <MiniCard
                title="Location"
                hasil={locationNames[selectedLocation] ?? "-"}
              />

              <MiniCard
                title="Nitrogen Dioxide"
                hasil={
                  currentLocationData?.nitrogen_dioxide != null
                    ? `${Number(currentLocationData.nitrogen_dioxide).toFixed(2)} μg/m³`
                    : "-"
                }
              />
              <MiniCard
                title="Temperature"
                hasil={
                  currentLocationData?.temperature_2m != null
                    ? `${Number(currentLocationData.temperature_2m).toFixed(2)} °C`
                    : "-"
                }
              />

              <MiniCard
                title="Wind Speed"
                hasil={
                  currentLocationData?.wind_speed_10m != null
                    ? `${Number(currentLocationData.wind_speed_10m).toFixed(2)} km/h`
                    : "-"
                }
              />

              <MiniCard
                title="Rain"
                hasil={
                  currentLocationData?.rain != null
                    ? `${Number(currentLocationData.rain).toFixed(2)} mm`
                    : "-"
                }
              />

              <MiniCard
                title="Relative Humidity"
                hasil={
                  currentLocationData?.relative_humidity_2m != null
                    ? `${Number(currentLocationData.relative_humidity_2m).toFixed(2)}%`
                    : "-"
                }
              />
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
                <MiniCardLocation
                  location="Jakarta Timur"
                  hasil={getLocationNO2(1)}
                />

                <MiniCardLocation location="Bogor" hasil={getLocationNO2(4)} />
              </Flex>

              <Flex w={"100%"} direction={"row"} gap={"2vh"}>
                <MiniCardLocation
                  location="Tangerang"
                  hasil={getLocationNO2(6)}
                />

                <MiniCardLocation location="Bekasi" hasil={getLocationNO2(3)} />
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
                  loading={loading}
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
