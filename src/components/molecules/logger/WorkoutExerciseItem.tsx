import Card from "@/components/atoms/Card";
import { Text, View } from "@/components/atoms/Themed";
import React from "react";
import SetItem from "./SetItem";
import { ExerciseWithSets } from "@/types/models";
import CustomButton from "@/components/atoms/CustomButton";
import { capitalizeWords } from "@/utils";
import { useWorkouts } from "@/store";

type WorkoutExerciseItem = {
  exercise: ExerciseWithSets;
};

export default function WorkoutExerciseItem({
  exercise,
  autoFocus = false,
}: WorkoutExerciseItem & { autoFocus?: boolean }) {
  const addSet = useWorkouts((state) => state.addSet);

  return (
    <Card title={capitalizeWords(exercise.name)}>
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
        <Text
          style={{ width: 40, textAlign: "center", fontWeight: "bold" }}
        ></Text>
      </View>

      <View style={{ gap: 5 }}>
        {exercise.sets.map((item, idx) => (
          <SetItem
            key={item.id}
            index={idx}
            set={item}
            autoFocus={autoFocus && idx === 0}
          />
        ))}
      </View>

      <CustomButton
        title="Add new set"
        type="link"
        onPress={() => addSet(exercise.id)}
        style={{ padding: 10, marginTop: 10 }}
      />
    </Card>
  );
}
