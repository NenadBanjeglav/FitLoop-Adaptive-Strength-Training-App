import { useLocalSearchParams } from "expo-router";
import { Text, View } from "@/components/atoms/Themed";
import { ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import exercises from "@/data/exercises";

const capitalizeWords = (text: string) =>
  text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function ExerciseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const exercise = exercises.find((e) => e.exerciseId === id);

  if (!exercise) {
    return <Text>Exercise not found</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        {exercise.gifUrl && (
          <View style={{ width: "100%" }}>
            <Image
              source={{ uri: exercise.gifUrl }}
              style={{
                width: "100%",
                height: 240,
                borderRadius: 12,
              }}
              resizeMode="contain"
            />
          </View>
        )}

        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            textAlign: "center",
            color: "#111",
          }}
        >
          {capitalizeWords(exercise.name)}
        </Text>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 16, color: "#007AFF" }}>
            <Text style={{ fontWeight: "bold" }}>Target:</Text>{" "}
            {exercise.targetMuscles.join(", ")}
          </Text>

          {exercise.secondaryMuscles?.length > 0 && (
            <Text style={{ fontSize: 16, color: "#FF9500" }}>
              <Text style={{ fontWeight: "bold" }}>Secondary:</Text>{" "}
              {exercise.secondaryMuscles.join(", ")}
            </Text>
          )}

          <Text style={{ fontSize: 16, color: "#6e6e6e" }}>
            <Text style={{ fontWeight: "bold" }}>Body Part:</Text>{" "}
            {exercise.bodyParts.join(", ")}
          </Text>

          <Text style={{ fontSize: 16, color: "#6e6e6e" }}>
            <Text style={{ fontWeight: "bold" }}>Equipment:</Text>{" "}
            {exercise.equipments.join(", ")}
          </Text>
        </View>

        <View
          style={{
            marginTop: 24,
            backgroundColor: "#f8f9fa",
            padding: 16,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              marginBottom: 8,
              color: "#333",
              textAlign: "center",
            }}
          >
            Instructions
          </Text>
          {exercise.instructions.map((step, idx) => (
            <Text
              key={idx}
              style={{
                fontSize: 15,
                lineHeight: 22,
                color: "#444",
                marginBottom: 6,
              }}
            >
              {idx + 1}. {step.replace(/^Step:\d+\s*/, "")}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
