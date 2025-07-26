import { Link } from "expo-router";
import { View, Text } from "@/components/atoms/Themed";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 30 }} lightColor="red" darkColor="blue">
        Title
      </Text>

      <Link href={"/workout/current"}>
        <Text>Resume Current Workout</Text>
      </Link>

      <Text>Home Screen</Text>

      <Link href={`/workout/123`}>
        <Text>Open Workout with id 123</Text>
      </Link>
    </View>
  );
}
