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

  const handleSendPrediction = async () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
      alert("Silakan login terlebih dahulu untuk melakukan prediksi.");
      router.push("/Login");
      return;
    }

    // Kalau sudah login, baru jalankan proses prediksi
    console.log("User sudah login, proses prediksi dijalankan.");

    try {
      // TODO: ganti dengan fetch API prediksi kamu yang sebenarnya
      // const res = await fetch("/api/predict", { method: "POST", body: ... });
      // const result = await res.json();

      // contoh sementara (dummy), nanti diganti hasil dari API:
      setPredictionData({
        value: 32.7,
        time: "22:00",
        method: "XGBoost",
        chartSeries: [26.8, 39.2, 15.2, 37.1, 46.8, 89.2, 35.2, 57.1],
        chartCategories: [
          "18:00",
          "19:00",
          "20:00",
          "21:00",
          "22:00",
          "23:00",
          "00:00",
          "01:00",
        ],
      });
    } catch (error) {
      console.error("Gagal mendapatkan prediksi:", error);
    }
  };

  return (
    <Flex
      direction={"column"}
      w={"100%"}
      bg={"bg.gradient"}
      minH={"100vh"}
      gap={{ base: "0", lg: "3vh" }}
      // pb={"4vh"}
      justify={"center"}
      align={"center"}>
      <Flex
        w={"100%"}
        direction={"row"}
        gap={"15vh"}
        justify={"center"}
        py={"4vh"}>
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
          // maxH={"100vh"}
        >
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
            direction={"column"}>
            <Flex
              w={"100%"}
              // h={"27vh"}
              p={"2.5vh"}
              borderRadius={"2vh"}
              bg={"bg.secondary"}
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
              direction={"column"}
              gap={"2vh"}
              h={"100%"}
              justify={"space-between"}>
              <Flex direction={"column"}>
                <Flex justify={"space-between"}>
                  <Text fontSize={"sm"} color={"text.thrid"}>
                    Current Weather
                  </Text>
                  <Flex
                    w={"30vh"}
                    direction={"row"}
                    gap={"1vh"}
                    align={"center"}>
                    <FaLocationDot /> <ComboBoxDashboard />
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
              gap="2vh">
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
              }}>
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
            gap={"2vh"}>
            <Flex
              p={"2.5vh"}
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
              borderRadius={"2vh"}
              bg={"bg.secondary"}
              gap={"2vh"}
              direction={"column"}>
              <Flex pb={"0.5vh"} borderBottom={"1px solid #dfdddd"}>
                <Text fontWeight={"bold"} color={"text.fouth"}>
                  Prediction Nitrogen Dioxide
                </Text>
              </Flex>
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={"2vh"}
                justify={"space-between"}>
                <Flex direction={"column"} w={{ base: "100%", md: "45%" }}>
                  <Text w={"20vh"} fontSize={"sm"} fontWeight={"bold"}>
                    Location
                  </Text>
                  <ComboBoxDashboard w={"100%"} />
                </Flex>

                <Flex w={"100%"} gap={"2vh"}>
                  <InputPrediction
                    title={"Temperature"}
                    placeholder="Temperature..."
                    satuan={"°C"}
                  />
                  <InputPrediction
                    title={"Wind Speed"}
                    placeholder="WindSpeed..."
                    satuan={"km/h"}
                  />{" "}
                </Flex>
              </Flex>
              <Flex direction={"row"} gap={"2vh"} justify={"space-between"}>
                <InputPrediction
                  title={"Rain"}
                  placeholder="Rain..."
                  satuan={"mm"}
                />
                <InputPrediction
                  title={"Relative Humidity"}
                  placeholder="Relative Humidity..."
                  satuan={"%"}
                />
              </Flex>
              <Flex justify={"center"}>
                <Button
                  w={"15vh"}
                  h={"4.5vh"}
                  borderRadius={"4vh"}
                  bg={"button.primary"}
                  onClick={handleSendPrediction}
                  _hover={{ bg: "hover.primary" }}>
                  Send
                </Button>
              </Flex>
            </Flex>

            <Flex
              w={"100%"}
              gap={"2vh"}
              direction={{ base: "column", md: "row" }}>
              <PredictionChart data={predictionData} />
              <Flex
                h={"100%"}
                w={{ base: "100%", md: "42%" }}
                direction="column"
                p={"2.5vh"}
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
                borderRadius={"2vh"}
                bg={"bg.secondary"}
                gap={"2vh"}>
                <Flex pb={"0.5vh"} borderBottom={"1px solid #dfdddd"}>
                  <Text fontWeight={"bold"} color={"text.fouth"}>
                    Prediction Result
                  </Text>
                </Flex>

                <Flex
                  w={"100%"}
                  direction={"column"}
                  gap={"1vh"}
                  justify={"space-between"}>
                  <Text fontSize={"sm"} color={"text.thrid"}>
                    Prediksi Berikut:
                  </Text>
                  <Flex
                    direction={"row"}
                    gap={"2vh"}
                    align={"center"}
                    justify={"center"}>
                    <Text
                      fontSize={"6xl"}
                      fontWeight={"bold"}
                      color={"text.fouth"}>
                      {predictionData ? predictionData.value : "-"}
                    </Text>
                    {predictionData && (
                      <Text fontSize={"sm"} color={"text.thrid"}>
                        μg/m
                      </Text>
                    )}
                  </Flex>

                  <Flex w={"100%"} direction={"row"} gap={"2vh"} mt={"1.5vh"}>
                    <Flex
                      w={"50%"}
                      bg={"card.primary"}
                      p={"1.5vh"}
                      borderRadius={"2vh"}>
                      <Flex
                        w={"100%"}
                        justify={"center"}
                        align={"center"}
                        gap={"1vh"}
                        direction={"column"}>
                        <Text
                          fontSize={"xs"}
                          textAlign={"center"}
                          fontWeight={"bold"}>
                          Waktu Prediksi
                        </Text>
                        <Text
                          textAlign={"center"}
                          fontSize={"xl"}
                          fontWeight={"bold"}
                          color={"text.thrid"}>
                          {predictionData ? predictionData.time : "-"}
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex
                      w={"50%"}
                      bg={"card.primary"}
                      p={"1.5vh"}
                      borderRadius={"2vh"}>
                      <Flex
                        w={"100%"}
                        h={"100%"}
                        justify={"center"}
                        direction={"column"}
                        gap={"1vh"}
                        align={"center"}>
                        <Text
                          fontSize={"xs"}
                          textAlign={"center"}
                          fontWeight={"bold"}>
                          Metode Prediksi
                        </Text>
                        <Text
                          textAlign={"center"}
                          fontSize={"lg"}
                          fontWeight={"bold"}
                          color={"text.thrid"}>
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

      <Flex
        w={{ base: "90%", lg: "60%" }}
        py={"4vh"}
        px={"4vh"}
        gap={{ base: "1vh", md: "3vh" }}
        bg={"bg.secondary"}
        direction={{ base: "column", md: "row" }}
        borderRadius={"2vh"}
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)">
        <Flex
          w={{ base: "100%", lg: "65%" }}
          direction={"column"}
          gap={"1.5vh"}>
          <Text
            fontSize={"xl"}
            fontWeight={"bold"}
            textAlign={{ base: "center", md: "start" }}>
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
          justify={"center"}>
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
        borderTop={"1px solid #e7e7e7"}>
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
