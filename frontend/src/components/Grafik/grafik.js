"use client";

import { Flex, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useColorModeValue } from "@/components/ui/color-mode";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function PredictionChart({ data }) {
  const textPrimary = useColorModeValue("#464646", "#ffffff");
  const hasData = !!data;

  const options = {
    chart: {
      height: 210,
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: hasData
        ? data.chartCategories
        : ["18:00","19:00","20:00","21:00","22:00","23:00","00:00","01:00"],
      labels: {
        style: { colors: textPrimary, fontSize: "8px" },
      },
    },
    yaxis: {
      min: -10,
      labels: {
        offsetX: -25,
        style: { colors: textPrimary, fontSize: "2px" },
      },
    },
    legend: { position: "bottom", horizontalAlign: "center" },
    grid: { borderColor: "#e7e7e7" },
    markers: { size: 4 },
  };

  const series = [
    {
      name: "Aktual",
      data: hasData ? data.chartSeries : [],
    },
  ];

  return (
    <>
      <style jsx global>{`
        .apexcharts-xaxis-label { font-size: 12px !important; }
        .apexcharts-yaxis-label { font-size: 12px !important; }
      `}</style>

      <Flex
        w={{ base: "100%", md: "59%" }}
        direction="column"
        p={"2.5vh"}
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
        borderRadius={"2vh"}
        bg={"bg.secondary"}
        gap={"2vh"}>
        <Flex pb={"0.5vh"} borderBottom={"1px solid #dfdddd"}>
          <Text fontWeight={"bold"} color={"text.fouth"}>
            Prediction Graph
          </Text>
        </Flex>

        <Flex mt={{ base: "-2.5vh", lg: "-1vh" }} position="relative">
          <Flex w={"100%"} direction={"column"} gap={"2vh"} h={"27vh"}>
            <Chart
              width="100%"
              options={options}
              series={series}
              type="line"
              height={"115%"}
            />
          </Flex>

          {!hasData && (
            <Flex
              position="absolute"
              inset={0}
              align="center"
              justify="center"
              bg="blackAlpha.50"
              borderRadius="1vh">
              <Text
                fontSize="sm"
                color="text.thrid"
                fontWeight="semibold"
                textAlign="center"
                px="2vh">
                Mohon isi data prediksi
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
}