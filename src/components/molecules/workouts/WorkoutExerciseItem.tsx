import React from "react";
import Card from "../../atoms/Card";
import { ExerciseWithSets } from "@/types/models";
import { Text, View } from "../../atoms/Themed";
import { getBestSet } from "@/utils";
import Colors from "@/constants/colors";

type WorkoutExerciseItem = {
  exercise: ExerciseWithSets;
};

export default function WorkoutExerciseItem({ exercise }: WorkoutExerciseItem) {
  const bestSet = getBestSet(exercise.sets);
  return (
    <Card title={exercise.name}>
      {exercise.sets.map((set, idx) => (
        <View
          key={set.id}
          style={{
            flexDirection: "row",
            gap: 15,
            padding: 8,
            backgroundColor:
              set.id == bestSet?.id ? Colors.dark.tint + "50" : "transparent",
          }}
        >
          <Text style={{ fontSize: 16, color: "gray" }}>{idx + 1}</Text>
          <Text style={{ fontSize: 16 }}>
            {set.reps}
            {set.weight ? ` x ${set.weight} kg` : " reps"}
          </Text>
          {set.oneRM && (
            <Text
              style={{ fontSize: 16, marginLeft: "auto", fontWeight: "bold" }}
            >
              {Math.floor(set.oneRM)} kg
            </Text>
          )}
        </View>
      ))}
    </Card>
  );
}
