import { Text, View } from "@/components/atoms/Themed";
import WorkoutExerciseItem from "@/components/molecules/logger/WorkoutExerciseItem";
import { FlatList } from "react-native";

export default function CurrentWorkoutScreen() {
  return (
    <FlatList
      contentContainerStyle={{ gap: 10, padding: 10 }}
      data={[1, 2]}
      renderItem={({ item }) => <WorkoutExerciseItem />}
    />
  );
}
