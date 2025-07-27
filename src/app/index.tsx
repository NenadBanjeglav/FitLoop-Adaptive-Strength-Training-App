import { Link } from "expo-router";
import { View } from "@/components/atoms/Themed";
import CustomButton from "@/components/atoms/CustomButton";
import WorkoutListItem from "@/components/molecules/workouts/WorkoutListItem";
import dummyWorkouts from "@/data/dummyWorkouts";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const workout = dummyWorkouts[0];

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          gap: 10,
          backgroundColor: "transparent",
        }}
      >
        <Link href={"/workout/current"} asChild>
          <CustomButton title="Start New Workout" />
        </Link>

        <FlatList
          contentContainerStyle={{ gap: 10, padding: 10 }}
          data={dummyWorkouts}
          renderItem={({ item }) => (
            <WorkoutListItem
              //@ts-ignore
              workout={item}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
