"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { system } from "./theme";
// import { system } from "@/theme"; // sesuaikan path ke file config kamu

export function Provider(props) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
    </ChakraProvider>
  );
}