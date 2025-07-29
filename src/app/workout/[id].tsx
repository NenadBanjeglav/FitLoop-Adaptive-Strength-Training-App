import { Redirect, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/atoms/Themed";
import WorkoutExerciseItem from "@/components/molecules/workouts/WorkoutExerciseItem";
import { Alert, FlatList, Pressable } from "react-native";
import dayjs from "dayjs";
import { useWorkouts } from "@/store";
import React from "react";
import { Feather } from "@expo/vector-icons";

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams();

  const workout = useWorkouts((state) =>
    state.workouts.find((workout) => workout.id == id)
  );
  const deleteWorkout = useWorkouts((state) => state.deleteWorkout);

  const handleDelete = () => {
    Alert.alert(
      "Delete Workout?",
      "This will permanently remove the workout from your history.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteWorkout(id as string);
          },
        },
      ]
    );
  };

  if (!workout) return <Redirect href={"/"} />;

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={handleDelete}
              hitSlop={10}
              style={({ pressed }) => ({
                padding: 6,
                marginRight: 10,
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Feather name="trash-2" size={20} color="red" />
            </Pressable>
          ),
        }}
      />
      <FlatList
        contentContainerStyle={{ gap: 10, padding: 10 }}
        ListHeaderComponent={
          <>
            <Text
              style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}
            >
              Workout Details
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              {dayjs(workout.createdAt).format("HH:mm dddd, D MMM")}
            </Text>
          </>
        }
        data={workout.exercises}
        renderItem={({ item }) => <WorkoutExerciseItem exercise={item} />}
      />
    </>
  );
}
