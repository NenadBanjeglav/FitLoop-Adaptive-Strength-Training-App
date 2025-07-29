import React from "react";
import Card from "../../atoms/Card";
import { Text, View } from "../../atoms/Themed";
import { StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { WorkoutWithExercises } from "@/types/models";
import dayjs from "dayjs";
import { calculateDuration, getBestSetByOneRM } from "@/utils";

type WorkoutListItem = {
  workout: WorkoutWithExercises;
};

export default function WorkoutListItem({ workout }: WorkoutListItem) {
  const totalWeight = workout.exercises.reduce(
    (total, { sets }) =>
      total +
      sets.reduce((sum, { reps = 0, weight = 0 }) => sum + reps * weight, 0),
    0
  );

  return (
    <Card
      href={`/workout/${workout.id}`}
      title={dayjs(workout.createdAt).format("HH:mm dddd, D MMM")}
      style={{ gap: 5 }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold" }}>Exercise</Text>
        <Text style={{ fontWeight: "bold" }}>Best Set</Text>
      </View>

      {workout.exercises.map((exercise) => {
        const bestSet = getBestSetByOneRM(exercise.sets);
        return (
          <View
            key={exercise.id}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "gray" }}>
              {exercise.sets.length} x {exercise.name}
            </Text>

            {bestSet && bestSet.weight != null && bestSet.reps != null ? (
              <Text style={{ color: "gray" }}>
                {bestSet.weight} x {bestSet.reps}
              </Text>
            ) : (
              <Text style={{ color: "gray" }}>No valid sets</Text>
            )}
          </View>
        );
      })}

      <View
        style={{
          flexDirection: "row",
          gap: 20,
          borderTopColor: "#333",
          borderTopWidth: StyleSheet.hairlineWidth,
          marginTop: 10,
          paddingTop: 10,
        }}
      >
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <FontAwesome5 name="clock" size={16} color="gray" />
          <Text>
            {calculateDuration(workout.createdAt, workout.finishedAt)}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <FontAwesome5 name="weight-hanging" size={16} color="gray" />
          <Text>{totalWeight} kg</Text>
        </View>
      </View>
    </Card>
  );
}
