import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "@/components/atoms/Themed";
import dummyWorkouts from "@/data/dummyWorkouts";
import WorkoutExerciseItem from "@/components/molecules/workouts/WorkoutExerciseItem";
import { FlatList } from "react-native";
import dayjs from "dayjs";

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams();

  const workout = dummyWorkouts.find((w) => w.id == id);

  if (!workout) return <Text>Workout not found</Text>;

  return (
    <FlatList
      contentContainerStyle={{ gap: 10, padding: 10 }}
      ListHeaderComponent={
        <>
          <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>
            Workout Details
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>
            {dayjs(workout.createdAt).format("HH:mm dddd, D MMM")}
          </Text>
        </>
      }
      data={workout.exercises}
      renderItem={({ item }) => (
        <WorkoutExerciseItem
          //@ts-ignore
          exercise={item}
        />
      )}
    />
  );
}
