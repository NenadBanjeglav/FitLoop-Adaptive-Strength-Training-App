import React from "react";
import Card from "../../atoms/Card";
import { ExerciseWithSets } from "@/types/models";
import { Text, View } from "../../atoms/Themed";

import Colors from "@/constants/colors";
import { getBestSetFromWorkout } from "@/utils";

type WorkoutExerciseItem = {
  exercise: ExerciseWithSets;
};

export default function WorkoutExerciseItem({ exercise }: WorkoutExerciseItem) {
  const best = getBestSetFromWorkout(exercise);
  return (
    <Card title={exercise.name}>
      {exercise.sets.map((set, idx) => {
        const isBest = set.id === best?.set.id;
        return (
          <View
            key={set.id}
            style={{
              flexDirection: "row",
              gap: 15,
              padding: 8,
              backgroundColor: isBest ? Colors.dark.tint + "50" : "transparent",
            }}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>{idx + 1}</Text>
            <Text style={{ fontSize: 16 }}>
              {set.reps}
              {set.weight ? ` x ${set.weight} kg` : " reps"}
            </Text>
            {isBest && (
              <Text
                style={{
                  fontSize: 16,
                  marginLeft: "auto",
                  fontWeight: "bold",
                }}
              >
                {Math.round(best.oneRM)} kg 1RM
              </Text>
            )}
          </View>
        );
      })}
    </Card>
  );
}
