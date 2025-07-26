import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="workout/current"
        options={{ title: "Current Workout" }}
      />
      <Stack.Screen name="workout/[id]" options={{ title: "Workout" }} />
    </Stack>
  );
}
