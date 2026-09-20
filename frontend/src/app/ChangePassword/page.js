"use client";

import { Button, Flex, Text } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePassword() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    // Ambil data user
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Akun tidak ditemukan. Silakan login terlebih dahulu.");
      router.push("/Login");
      return;
    }

    const user = JSON.parse(storedUser);

    // Cek password baru
    if (!newPassword) {
      alert("Password baru harus diisi.");
      return;
    }

    // Password minimal 8 karakter
    if (newPassword.length < 8) {
      alert("Password baru minimal 8 karakter.");
      return;
    }

    // Cek konfirmasi password
    if (!confirmPassword) {
      alert("Confirm new password harus diisi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Confirm new password tidak sama.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/change-password/${user.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword,
            confirmPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal mengubah password.");
        return;
      }

      alert("Password berhasil diubah.");

      router.push("/Profile");
    } catch (error) {
      console.error("Error:", error);
      alert("Tidak dapat terhubung ke server.");
    }
  };

  return (
    <Flex w="100%" minH="100vh" justify="center" align="center">
      <Flex
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
        bg="bg.secondary"
        w={{ base: "90%", md: "55%", lg: "45%", xl: "40%" }}
        py="3vh"
        px="4vh"
        direction="column"
        gap="2vh"
        borderRadius="2vh"
        justify="center"
      >
        {/* Header */}
        <Flex
          borderBottom="1px solid #d6d1d1"
          pb="0.5vh"
          align="center"
          justify="center"
        >
          <Text fontWeight="bold" fontSize="xl">
            Change Password
          </Text>
        </Flex>

        <Flex direction="column" gap="1.5vh">
          {/* New Password */}
          <Flex direction={{ base: "column", sm: "row" }} align="center">
            <Text w={"100%"}>New Password</Text>

            <PasswordInput
              h="4vh"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan password baru..."
              bg={"bg.input"}
              color={"blackAlpha.800"}
              _placeholder={{ color: "#5f5d5d" }}
            />
          </Flex>

          {/* Confirm New Password */}
          <Flex direction={{ base: "column", sm: "row" }} align="center">
            <Text w={"100%"}>Confirm New Password</Text>

            <PasswordInput
              h="4vh"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi password baru..."
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
            mt="1vh"
          >
            <Button
              w="30vh"
              fontWeight="bold"
              bg="button.primary"
              _hover={{
                bg: "hover.primary",
              }}
              borderRadius="4vh"
              onClick={handleChangePassword}
            >
              Save Password
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
