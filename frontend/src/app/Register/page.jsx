"use client";

import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

const handleSignUp = async () => {
  if (!username || !email || !password || !confirmPassword) {
    alert("Semua data harus diisi.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Password dan Confirm Password tidak sama.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Registrasi gagal.");
      return;
    }

    alert("Sign Up berhasil!");

    router.push("/Login");
  } catch (error) {
    console.error("Error:", error);
    alert("Tidak dapat terhubung ke server.");
  }
};
  return (
    <Flex w="100%" minH="100vh" justify="center" align="center">
      <Flex
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
        bg={"bg.secondary"}
        w={{ base: "90%", md: "55%", lg: "45%", xl: "35%" }}
        py={"3vh"}
        px={"4vh"}
        direction={"column"}
        gap={"2vh"}
        borderRadius={"2vh"}
        justify={"center"}>
        <Flex
          w={"100%"}
          justify={"center"}
          borderBottom={"1px solid #dfdddd"}
          pb={"0.5vh"}>
          <Text fontWeight={"bold"} fontSize={"xl"}>
            Signup
          </Text>
        </Flex>

        {/* Username */}
        <Flex direction={{ base: "column", sm: "row" }} align={"center"}>
          <Text w={{ base: "100%", sm: "30vh" }}>Username</Text>

          <Input
            h={"4vh"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={"Masukkan Username..."}
            bg={"bg.input"}
            color={"blackAlpha.800"}
            _placeholder={{ color: "#5f5d5d" }}
          />
        </Flex>

        {/* Email */}
        <Flex direction={{ base: "column", sm: "row" }} align={"center"}>
          <Text w={{ base: "100%", sm: "30vh" }}>Email</Text>

          <Input
            h={"4vh"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={"Masukkan Email..."}
            bg={"bg.input"}
            color={"blackAlpha.800"}
            _placeholder={{ color: "#5f5d5d" }}
          />
        </Flex>

        {/* Password */}
        <Flex direction={{ base: "column", sm: "row" }} align={"center"}>
          <Text w={{ base: "100%", sm: "29vh" }}>Password</Text>

          <PasswordInput
            h={"4vh"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={"Masukkan Password..."}
            bg={"bg.input"}
            color={"blackAlpha.800"}
            _placeholder={{ color: "#5f5d5d" }}
          />
        </Flex>

        {/* Confirm Password */}
        <Flex direction={{ base: "column", sm: "row" }} align={"center"}>
          <Text w={{ base: "100%", sm: "29vh" }}>Confirm Password</Text>

          <PasswordInput
            h={"4vh"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={"Masukkan Password Kembali..."}
            bg={"bg.input"}
            color={"blackAlpha.800"}
            _placeholder={{ color: "#5f5d5d" }}
          />
        </Flex>

        {/* Button */}
        <Flex mt={"1vh"} w={"100%"} justify={"center"}>
          <Button
            w={"30vh"}
            fontWeight={"bold"}
            bg={"button.primary"}
            _hover={{ bg: "hover.primary" }}
            borderRadius={"4vh"}
            onClick={handleSignUp}>
            Sign Up
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}