"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import UserProvider from "@/api/Context/UserContext";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <UserProvider>{children}</UserProvider>
    </NextThemesProvider>
  );
}
