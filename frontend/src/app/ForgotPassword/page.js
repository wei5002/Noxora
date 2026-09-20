"use client";

import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleForgotPassword = () => {
    if (!email) {
      alert("Silakan masukkan email Anda.");
      return;
    }

    // Nanti di sini bisa diganti dengan API backend
    // untuk mengirim reset password link

    setShowPopup(true);
  };

  return (
    <Flex w="100%" minH="100vh" justify="center" align="center">
      <Flex
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
        bg="bg.secondary"
        w={{ base: "90%", md: "55%", lg: "45%", xl: "30%" }}
        py="3vh"
        px="4vh"
        direction="column"
        gap="2vh"
        borderRadius="2vh"
        justify="center">
        {/* Header */}
        <Flex
          borderBottom="1px solid #d6d1d1"
          pb="0.5vh"
          align="center"
          justify="center">
          <Text fontWeight="bold" fontSize="xl">
            Forgot Password
          </Text>
        </Flex>

        {/* Form */}
        <Flex direction="column" gap="1.5vh">
          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "center" }}
            gap={{ base: "0.5vh", sm: "2vh" }}>
            <Text w={{ base: "100%", sm: "25%" }}>Email</Text>

            <Input
              w={{ base: "100%", sm: "75%" }}
              h="4vh"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan Email Anda..."
              bg={"bg.input"}
              color={"blackAlpha.800"}
              _placeholder={{ color: "#5f5d5d" }}
            />
          </Flex>

          {/* Button */}
          <Flex
            w="100%"
            justify="center"
            align="center"
            direction="column"
            gap="1vh"
            mt="1vh">
            <Button
              w="30vh"
              fontWeight="bold"
              bg="button.primary"
              _hover={{
                bg: "hover.primary",
              }}
              borderRadius="4vh"
              onClick={handleForgotPassword}>
              Send Email
            </Button>
          </Flex>
        </Flex>
      </Flex>

      {/* POPUP */}
      {showPopup && (
        <Flex
          position="fixed"
          inset="0"
          bg="rgba(0, 0, 0, 0.5)"
          justify="center"
          align="center"
          zIndex="9999"
          onClick={() => setShowPopup(false)}>
          <Flex
            bg="bg.secondary"
            w={{ base: "85%", md: "40%", lg: "30%" }}
            p="4vh"
            borderRadius="2vh"
            direction="column"
            align="center"
            gap="2vh"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
            onClick={(e) => e.stopPropagation()}>
            <Text fontSize="xl" fontWeight="bold" color="text.primary">
              Email Terkirim
            </Text>

            <Text textAlign="center" fontSize="sm" color="text.thrid">
              Silakan cek email Anda untuk mendapatkan link reset password.
            </Text>

            <Button
              w="15vh"
              bg="button.primary"
              borderRadius="4vh"
              fontWeight="bold"
              onClick={() => router.push("/Login")}
              _hover={{
                bg: "hover.primary",
              }}>
              OK
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
