"use client";

import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePassword() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    // Ambil data user
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Akun tidak ditemukan. Silakan login terlebih dahulu.");
      router.push("/Login");
      return;
    }

    const user = JSON.parse(storedUser);

    // Cek password baru tidak boleh kosong
    if (!newPassword) {
      alert("New password harus diisi.");
      return;
    }

    // Cek konfirmasi password
    if (newPassword !== confirmPassword) {
      alert("Confirm new password tidak sama.");
      return;
    }

    // Cek password baru berbeda dengan password lama
    if (newPassword === user.password) {
      alert("Password baru harus berbeda dengan password lama.");
      return;
    }

    // Update password
    const updatedUser = {
      ...user,
      password: newPassword,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Password berhasil diubah.");

    // Kembali ke Profile
    router.push("/Profile");
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
        justify="center">
        {/* Header */}
        <Flex
          borderBottom="1px solid #d6d1d1"
          pb="0.5vh"
          align="center"
          justify="center">
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
            mt="1vh">
            <Button
              w="30vh"
              fontWeight="bold"
              bg="button.primary"
              _hover={{
                bg: "hover.primary",
              }}
              borderRadius="4vh"
              onClick={handleChangePassword}>
              Save Password
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}