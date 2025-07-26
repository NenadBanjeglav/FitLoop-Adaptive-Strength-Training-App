import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "@/components/atoms/Themed";

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1 }}>
      <Link href={`/`}>Home Screen</Link>
      <Text>Workout Details Screen {id}</Text>
    </View>
  );
}
