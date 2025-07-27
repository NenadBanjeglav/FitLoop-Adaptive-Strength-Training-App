import CustomButton from "@/components/atoms/CustomButton";
import { View } from "@/components/atoms/Themed";
import WorkoutExerciseItem from "@/components/molecules/logger/WorkoutExerciseItem";
import WorkoutHeader from "@/components/molecules/logger/WorkoutHeader";
import { router, Stack } from "expo-router";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";

export default function CurrentWorkoutScreen() {
  return (
    <>
      <Stack.Screen
        name="workout/current"
        options={{
          headerRight: () => (
            <CustomButton
              title="Finish"
              onPress={() => console.log("Finished")}
              style={{ padding: 7, paddingHorizontal: 15, width: "auto" }}
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
          data={[1, 2]}
          renderItem={() => <WorkoutExerciseItem />}
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
