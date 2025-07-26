import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import Colors from "@/constants/colors";

DarkTheme.colors.primary = Colors.dark.tint;
DefaultTheme.colors.primary = Colors.light.tint;

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme == "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen
          name="workout/current"
          options={{ title: "Current Workout" }}
        />
        <Stack.Screen name="workout/[id]" options={{ title: "Workout" }} />
      </Stack>
    </ThemeProvider>
  );
}
