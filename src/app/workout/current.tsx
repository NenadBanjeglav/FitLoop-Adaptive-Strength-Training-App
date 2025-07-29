import CustomButton from "@/components/atoms/CustomButton";
import WorkoutExerciseItem from "@/components/molecules/logger/WorkoutExerciseItem";
import WorkoutHeader from "@/components/molecules/logger/WorkoutHeader";
import { useWorkouts } from "@/store";
import { Redirect, router, Stack } from "expo-router";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function CurrentWorkoutScreen() {
  const currentWorkout = useWorkouts((state) => state.currentWorkout);
  const finishWorkout = useWorkouts((state) => state.finishWorkout);

  if (!currentWorkout) {
    return <Redirect href={"/"} />;
  }

  return (
    <>
      <Stack.Screen
        name="workout/current"
        options={{
          headerRight: () => (
            <CustomButton
              title="Finish"
              onPress={() => {
                Keyboard.dismiss(); // force blur input
                setTimeout(() => {
                  finishWorkout(); // wait for onBlur to trigger
                }, 100); // small delay ensures blur handlers fire
              }}
              style={{ padding: 7, paddingHorizontal: 15, width: "auto" }}
              hitSlop={40}
            />
          ),
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={110}
      >
        <FlatList
          contentContainerStyle={{ gap: 10, padding: 10 }}
          data={currentWorkout.exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <WorkoutExerciseItem exercise={item} />}
          ListHeaderComponent={<WorkoutHeader />}
          ListFooterComponent={
            <CustomButton
              title="Add Exercise"
              onPress={() => router.push("/workout/select-exercise")}
            />
          }
        />
      </KeyboardAvoidingView>
    </>
  );
}
