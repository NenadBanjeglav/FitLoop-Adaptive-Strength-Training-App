import { Link, useRouter } from "expo-router";
import { View } from "@/components/atoms/Themed";
import CustomButton from "@/components/atoms/CustomButton";
import WorkoutListItem from "@/components/molecules/workouts/WorkoutListItem";

import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkouts } from "@/store";

export default function HomeScreen() {
  const router = useRouter();
  const currentWorkout = useWorkouts((state) => state.currentWorkout);
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const workouts = useWorkouts((state) => state.workouts);

  const onStartWorkout = async () => {
    await startWorkout();
    router.push("/workout/current");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          gap: 10,
          backgroundColor: "transparent",
        }}
      >
        {currentWorkout ? (
          <Link href={"/workout/current"} asChild>
            <CustomButton title="Resume Workout" />
          </Link>
        ) : (
          <CustomButton title="Start New Workout" onPress={onStartWorkout} />
        )}

        <FlatList
          contentContainerStyle={{ gap: 10, padding: 10 }}
          data={workouts}
          renderItem={({ item }) => (
            <WorkoutListItem key={item.id} workout={item} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
