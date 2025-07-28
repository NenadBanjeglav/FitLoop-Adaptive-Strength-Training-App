import { useLocalSearchParams } from "expo-router";
import { Text } from "@/components/atoms/Themed";
import dummyWorkouts from "@/data/dummyWorkouts";
import WorkoutExerciseItem from "@/components/molecules/workouts/WorkoutExerciseItem";
import { FlatList } from "react-native";
import dayjs from "dayjs";
import { useWorkouts } from "@/store";

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams();

  const workout = useWorkouts((state) =>
    state.workouts.find((workout) => workout.id == id)
  );

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
      renderItem={({ item }) => <WorkoutExerciseItem exercise={item} />}
    />
  );
}
