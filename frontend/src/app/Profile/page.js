"use client";

import { Avatar, Button, Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telp, setTelp] = useState("");

  // Ambil data user dari localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/Login");
      return;
    }

    const user = JSON.parse(storedUser);

    setUsername(user.username || "");
    setEmail(user.email || "");
    setTelp(user.telp || "-");
  }, [router]);

  // DELETE ACCOUNT
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Apakah anda ini menghapus akun?");

    if (!confirmDelete) {
      return;
    }

    // Hapus data akun
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    // Beritahu component lain bahwa user sudah logout
    window.dispatchEvent(new Event("login"));

    alert("Akun berhasil dihapus.");

    // Kembali ke halaman login
    router.push("/Login");
  };

  // EDIT / SAVE ACCOUNT
  const handleEdit = () => {
    // Kalau belum edit → masuk mode edit
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // Kalau sedang edit → simpan perubahan
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Data akun tidak ditemukan.");
      return;
    }

    const user = JSON.parse(storedUser);

    const updatedUser = {
      ...user,
      username: username,
      email: email,
      telp: telp,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setIsEditing(false);

    alert("Profile berhasil diperbarui.");
  };

  return (
    <Flex w="100%" minH="100vh" justify="center" align="center">
      <Flex
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
        bg="bg.secondary"
        w={{ base: "90%", md: "60%", lg: "50%" }}
        py="3vh"
        px="4vh"
        direction="column"
        gap="2vh"
        borderRadius="2vh"
        justify="center">
        {/* Header */}
        <Flex
          w="100%"
          justify="center"
          borderBottom="1px solid #dfdddd"
          pb="2vh"
          // align="center"
          gap="1vh"
          direction={{ base: "column", sm: "row" }}>
          <Flex direction={"row"} gap={"2vh"} align="center">
            <Avatar.Root w="12vh" h="12vh">
              <Avatar.Fallback name={username} />
              <Avatar.Image src="" />
            </Avatar.Root>

            <Flex
              w="100%"
              direction="row"
              gap="0.5vh"
              justify="space-between"
              align="center">
              <Flex w="100%" direction="column" gap="0.5vh">
                <Text fontWeight="bold" fontSize="xl">
                  {username}
                </Text>

                <Flex direction="row" gap="1vh" align="center">
                  <Text color="text.thrid" fontSize="sm" w="8vh">
                    Email
                  </Text>

                  <Text color="text.thrid" fontSize="sm">
                    :
                  </Text>

                  <Text color="text.thrid" fontSize="sm">
                    {email}
                  </Text>
                </Flex>

                <Flex direction="row" gap="1vh" align="center">
                  <Text color="text.thrid" fontSize="sm" w="8vh">
                    Telp.
                  </Text>

                  <Text color="text.thrid" fontSize="sm">
                    :
                  </Text>

                  <Text color="text.thrid" fontSize="sm">
                    {telp || "-"}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          <Flex
          
            w="100%"
            direction="column"
            gap="0.5vh"
            justify="center"
            align="end">
            <Button
              w={{base:"100%",sm:"20vh"}}
              fontWeight="bold"
              bg="button.third"
              _hover={{
                bg: "hover.primary",
              }}
              onClick={() => router.push("/ChangePassword")}
              borderRadius="4vh">
              Change Password
            </Button>
          </Flex>
        </Flex>

        {/* Username */}
        <Flex direction="row" align="center">
          <Text w="30vh">Username</Text>

          <Input
            bg={isEditing ? "white" : "gray.100"}
            h="4vh"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan Username..."
            _placeholder={{
              color: "text.thrid",
            }}
            readOnly={!isEditing}
          />
        </Flex>

        {/* Email */}
        <Flex direction="row" align="center">
          <Text w="30vh">Email</Text>

          <Input
            bg={isEditing ? "white" : "gray.100"}
            h="4vh"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan Email..."
            _placeholder={{
              color: "text.thrid",
            }}
            readOnly={!isEditing}
          />
        </Flex>

        {/* Telp */}
        <Flex direction="row" align="center">
          <Text w="30vh">Telp</Text>

          <Input
            bg={isEditing ? "white" : "gray.100"}
            h="4vh"
            value={telp}
            onChange={(e) => setTelp(e.target.value)}
            placeholder="Masukkan Nomor Telepon..."
            _placeholder={{
              color: "text.thrid",
            }}
            readOnly={!isEditing}
          />
        </Flex>

        {/* Buttons */}
        <Flex w="100%" justify="center" direction={{base:"column",sm:"row"}} gap="2vh">
          <Button
            w={{base:"100%",sm:"20vh"}}
            fontWeight="bold"
            bg="button.fouth"
            _hover={{
              bg: "hover.primary",
            }}
            borderRadius="4vh"
            onClick={handleDeleteAccount}>
            Delete Account
          </Button>

          <Button
            w={{base:"100%",sm:"20vh"}}
            fontWeight="bold"
            bg="button.primary"
            _hover={{
              bg: "hover.primary",
            }}
            borderRadius="4vh"
            onClick={handleEdit}>
            {isEditing ? "Save" : "Edit"}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
