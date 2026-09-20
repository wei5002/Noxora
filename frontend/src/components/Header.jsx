// components/Header.jsx
"use client";

import { Button, Flex, Text } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RiCloudWindyFill } from "react-icons/ri";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [now, setNow] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // =====================================================
  // CEK STATUS LOGIN
  // =====================================================
  useEffect(() => {
    const checkLogin = () => {
      const loggedIn = localStorage.getItem("isLoggedIn");

      setIsLoggedIn(loggedIn === "true");
    };

    // Cek ketika Header pertama kali muncul
    checkLogin();

    // Cek jika ada perubahan localStorage
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  // =====================================================
  // CEK KEMBALI KETIKA PINDAH HALAMAN
  // =====================================================
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");

    setIsLoggedIn(loggedIn === "true");
  }, [pathname]);

  // =====================================================
  // DATE
  // =====================================================
  useEffect(() => {
    // Set tanggal pertama kali
    setNow(new Date());

    // Update setiap 1 detik
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    // Bersihkan interval ketika component unmount
    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================
  const formattedDateTime = now
    ? now.toLocaleDateString("en-US", {
        // weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // =====================================================
  // LOGO
  // =====================================================
  const handleLogoClick = () => {
    if (pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      router.push("/");
    }
  };

  // =====================================================
  // UPLOAD / PREDICTION
  // =====================================================
  const handleUploadClick = () => {
    if (pathname === "/") {
      document.getElementById("uploadImage")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      sessionStorage.setItem("scrollTarget", "uploadImage");

      router.push("/");
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================
  const handleLogout = () => {
    const confirmed = window.confirm("Apakah Anda yakin ingin logout?");

    // Jika tekan Cancel
    if (!confirmed) {
      return;
    }

    // Hapus status login
    localStorage.removeItem("isLoggedIn");

    // Ubah state Header
    setIsLoggedIn(false);

    // Kembali ke halaman utama
    router.push("/");
  };

  return (
    <Flex
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
      zIndex={10000}
      bg="bg.secondary"
      position="fixed"
      top="3vh"
      left="5%"
      w="90%"
      borderRadius="2vh">
      <Flex
        w="100%"
        align="center"
        flexWrap={{
          base: "wrap",
          md: "nowrap",
        }}
        gap={{
          base: "1vh",
          md: "2vh",
        }}
        px={{
          base: "2vh",
          sm: "3vh",
          md: "3vh",
          lg: "4vh",
        }}
        py={{
          base: "2vh",
          sm: "2.5vh",
          md: "2.5vh",
          lg: "2.5vh",
        }}>
        {/* =========================
      LOGO + DATE + COLOR MODE
  ========================= */}
        <Flex
          flex="1"
          minW={{
            base: "100%",
            md: "auto",
          }}
          direction="row"
          align="center"
          justify="space-between"
          gap="2vh">
          {/* LOGO */}
          <Flex
            direction="row"
            align="center"
            gap="1vh"
            cursor="pointer"
            flexShrink={0}
            onClick={handleLogoClick}>
            <RiCloudWindyFill size="4vh" />

            <Text fontWeight="bold" fontSize={"lg"}>
              Noxora
            </Text>
          </Flex>

          {/* DATE + COLOR MODE */}
          <Flex
            direction="row"
            align="center"
            gap={{
              base: "1vh",
              md: "2vh",
            }}
            minW={0}>
            <Text
              fontSize="sm"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis">
              {formattedDateTime}
            </Text>

            <ColorModeButton />
          </Flex>
        </Flex>

        {/* LOGIN + SIGN UP */}
        <Flex
          w={{
            base: "100%",
            md: "auto",
          }}
          justify={{
            base: "center",
            md: "end",
          }}
          direction="row"
          gap={{
            base: "1vh",
            md: "1.5vh",
          }}
          flexShrink={0}>
          {/* LOGIN / PROFILE */}
          {isLoggedIn ? (
            <>
              <Button
                w={{
                  base: "12vh",
                  sm: "13vh",
                }}
                h={{
                  base: "4vh",
                  sm: "4.5vh",
                }}
                _hover={{ bg: "hover.primary" }}
                fontSize={"sm"}
                fontWeight="bold"
                bg="button.primary"
                borderRadius="10vh"
                onClick={() => router.push("/Profile")}>
                Profile
              </Button>

              <Button
                w={{
                  base: "12vh",
                  sm: "13vh",
                }}
                _hover={{ bg: "hover.primary" }}
                h={{
                  base: "4vh",
                  sm: "4.5vh",
                }}
                fontSize={"sm"}
                fontWeight="bold"
                bg="button.thirth"
                borderRadius="10vh"
                onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                w={{
                  base: "12vh",
                  sm: "13vh",
                }}
                _hover={{ bg: "hover.primary" }}
                h={{
                  base: "4vh",
                  sm: "4.5vh",
                }}
                fontSize={"sm"}
                fontWeight="bold"
                bg="button.primary"
                borderRadius="10vh"
                onClick={() => router.push("/Login")}>
                Login
              </Button>

              <Button
                w={{
                  base: "12vh",
                  sm: "13vh",
                }}
                _hover={{ bg: "hover.primary" }}
                h={{
                  base: "4vh",
                  sm: "4.5vh",
                }}
                fontSize={"sm"}
                fontWeight="bold"
                bg="button.thirth"
                borderRadius="10vh"
                onClick={() => router.push("/Register")}>
                Sign up
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
