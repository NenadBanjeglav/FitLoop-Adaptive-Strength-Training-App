import CustomButton from "@/components/atoms/CustomButton";
import { View } from "@/components/atoms/Themed";
import WorkoutExerciseItem from "@/components/molecules/logger/WorkoutExerciseItem";
import WorkoutHeader from "@/components/molecules/logger/WorkoutHeader";
import { useWorkouts } from "@/store";
import { Redirect, router, Stack } from "expo-router";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export default function CurrentWorkoutScreen() {
  const currentWorkout = useWorkouts((state) => state.currentWorkout);
  const finishWorkout = useWorkouts((state) => state.finishWorkout);
  const discardWorkout = useWorkouts((state) => state.discardCurrentWorkout);

  if (!currentWorkout) {
    return <Redirect href={"/"} />;
  }

  return (
    <>
      <Stack.Screen
        name="workout/current"
        options={{
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                gap: 30,
                marginRight: 30,
                alignItems: "center",
                marginLeft: "auto",
              }}
            >
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  Alert.alert(
                    "Discard Workout?",
                    "Are you sure you want to discard your current workout?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Discard",
                        style: "destructive",
                        onPress: () => {
                          setTimeout(() => {
                            discardWorkout();
                          }, 100);
                        },
                      },
                    ]
                  );
                }}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Feather name="trash-2" size={20} color="red" />
              </Pressable>

              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  Alert.alert(
                    "Finish Workout?",
                    "Once you finish, you won't be able to edit this workout.",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Finish",
                        style: "default",
                        onPress: () => {
                          setTimeout(() => {
                            finishWorkout();
                          }, 100);
                        },
                      },
                    ]
                  );
                }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Feather name="check-circle" size={20} color="#007AFF" />
              </Pressable>
            </View>
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
              type="link"
              title="Add Exercise"
              onPress={() => router.push("/workout/select-exercise")}
            />
          }
        />
      </KeyboardAvoidingView>
    </>
  );
}
