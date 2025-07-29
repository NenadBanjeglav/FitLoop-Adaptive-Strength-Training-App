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
import {
  createCatalogExercisesTableQuery,
  createLoggedExercisesTableQuery,
  createSetsTableQuery,
  createWorkoutsTableQuery,
  dbName,
  getDB,
  seedCatalogExercises,
} from "@/db";
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

  // useEffect(() => {
  //   const wipeDB = async () => {
  //     try {
  //       if (__DEV__) {
  //         await SQLite.deleteDatabaseAsync("fitLoop.db");
  //         console.log("✅ Deleted DB file");

  //         const db = await SQLite.openDatabaseAsync("fitLoop.db");

  //         await db.execAsync(createCatalogExercisesTableQuery);
  //         await db.execAsync(createWorkoutsTableQuery);
  //         await db.execAsync(createLoggedExercisesTableQuery);
  //         await db.execAsync(createSetsTableQuery);

  //         await seedCatalogExercises();

  //         console.log("✅ Recreated + seeded DB");
  //       }
  //     } catch (err) {
  //       console.error("❌ Failed to reset database:", err);
  //     }
  //   };
  // });

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
