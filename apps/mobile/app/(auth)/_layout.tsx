import React from "react";
import { Stack } from "expo-router";

// Keep auth stack simple and header-less; content uses its own back button
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
