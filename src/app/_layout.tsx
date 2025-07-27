import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import Colors from "@/constants/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

DarkTheme.colors.primary = Colors.dark.tint;
DefaultTheme.colors.primary = Colors.light.tint;

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme == "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen
              name="workout/current"
              options={{ title: "Current Workout" }}
            />
            <Stack.Screen name="workout/[id]" options={{ title: "Workout" }} />

            <Stack.Screen
              name="workout/select-exercise"
              options={{ title: "Select Exercise" }}
            />
            <Stack.Screen
              name="exercise/[id]"
              options={{ title: "Exercise Info" }}
            />
          </Stack>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
