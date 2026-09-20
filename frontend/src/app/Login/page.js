"use client";

import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Ambil data user yang disimpan saat Sign Up
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Akun belum terdaftar. Silakan Sign Up terlebih dahulu.");
      return;
    }

    const user = JSON.parse(storedUser);

    // Cek username dan password
    if (username === user.username && password === user.password) {
      // Tandai bahwa user sudah login
      localStorage.setItem("isLoggedIn", "true");

      window.dispatchEvent(new Event("login"));

      alert("Login berhasil!");

      router.push("/");
    } else {
      alert("Username atau password salah.");
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
        {/* Header */}
        <Flex
          w={"100%"}
          justify={"center"}
          borderBottom={"1px solid #dfdddd"}
          pb={"0.5vh"}>
          <Text fontWeight={"bold"} fontSize={"xl"}>
            Login
          </Text>
        </Flex>

        {/* Username */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          align={"center"}
          justify={"space-between"}>
          <Text w={{ base: "100%", sm: "30vh" }}>Username</Text>

          <Input
            bg={"bg.input"}
            color={"blackAlpha.800"}
            _placeholder={{ color: "#5f5d5d" }}
            h={"4vh"}
            w={"100%"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={"Masukkan Username..."}
          />
        </Flex>

        {/* Password */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          align="center"
          justify="space-between">
          <Text w={{ base: "100%", sm: "29vh" }}>Password</Text>

          <PasswordInput
            h="4vh"
            w={"100%"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan Password..."
            bg={"bg.input"}
            color={"blackAlpha.800"}
            _placeholder={{ color: "#5f5d5d" }}
          />
        </Flex>

        {/* Forgot Password */}
        <Flex w="100%" justify="flex-end" mt="-1vh">
          <Text
            fontSize="xs"
            color="text.fouth"
            cursor="pointer"
            _hover={{
              textDecoration: "underline",
            }}
            onClick={() => router.push("/ForgotPassword")}>
            Forgot Password?
          </Text>
        </Flex>

        {/* Login Button */}
        <Flex
          w={"100%"}
          justify={"center"}
          align={"center"}
          direction={"column"}
          gap={"1vh"}
          // mt={"1vh"}
        >
          <Button
            w={"30vh"}
            fontWeight={"bold"}
            bg={"button.primary"}
            _hover={{
              bg: "hover.primary",
            }}
            borderRadius={"4vh"}
            onClick={handleLogin}>
            Login
          </Button>
          <Flex direction="row" gap={"1"}>
            <Text fontSize={"xs"} color={"text.thrid"}>
              Don&apos;t have an account?
            </Text>
            <Text
              fontSize="xs"
              color="text.fouth"
              cursor="pointer"
              _hover={{
                textDecoration: "underline",
              }}
              onClick={() => router.push("/Register")}>
              Sign up
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
