import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import Colors from "@/constants/colors";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { dbName, getDB, seedCatalogExercises } from "@/db";
import { useWorkouts } from "@/store";

DarkTheme.colors.primary = Colors.dark.tint;
DefaultTheme.colors.primary = Colors.light.tint;

const db = SQLite.openDatabaseSync(dbName);

getDB();

export default function RootLayout() {
  useDrizzleStudio(db);
  const colorScheme = useColorScheme();

  const hydrateCurrentWorkout = useWorkouts(
    (state) => state.hydrateCurrentWorkout
  );
  const loadWorkouts = useWorkouts((state) => state.loadWorkouts);

  useEffect(() => {
    seedCatalogExercises();
    hydrateCurrentWorkout();
    loadWorkouts();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme == "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen
              name="workout/current"
              options={{ title: "Workout" }}
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
