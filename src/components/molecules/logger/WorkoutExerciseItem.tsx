import Card from "@/components/atoms/Card";
import { Text, View } from "@/components/atoms/Themed";
import React from "react";
import SetItem from "./SetItem";
import { ExerciseSet } from "@/types/models";
import CustomButton from "@/components/atoms/CustomButton";

export default function WorkoutExerciseItem() {
  const sets: ExerciseSet[] = [
    {
      id: "1",
      weight: 20,
      reps: 10,
      exerciseId: "e1",
    },
    {
      id: "2",
      weight: 40,
      reps: 5,
      exerciseId: "e2",
    },
  ];

  return (
    <Card title="Exercise">
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
          gap: 5,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginRight: "auto",
          }}
        >
          Set
        </Text>
        <Text style={{ width: 60, textAlign: "center", fontWeight: "bold" }}>
          kg
        </Text>
        <Text style={{ width: 60, textAlign: "center", fontWeight: "bold" }}>
          Reps
        </Text>
      </View>

      <View style={{ gap: 5 }}>
        {sets.map((item, idx) => (
          <SetItem key={item.id} index={idx} set={item} />
        ))}
      </View>

      <CustomButton
        title="Add new set"
        type="link"
        onPress={() => console.log("Add set")}
        style={{ padding: 10, marginTop: 10 }}
      />
    </Card>
  );
}
