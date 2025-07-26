import React from "react";
import Card from "../../atoms/Card";
import { Text, View } from "../../atoms/Themed";
import { StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { WorkoutWithExercises } from "@/types/models";
import dayjs from "dayjs";
import { getBestSet } from "@/utils";

type WorkoutListItem = {
  workout: WorkoutWithExercises;
};

export default function WorkoutListItem({ workout }: WorkoutListItem) {
  const calculateDuration = (start: Date, end: Date | null) => {
    if (!end) return "0:00";

    const duration = dayjs(end).diff(dayjs(start), "minutes");
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

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
        const bestSet = getBestSet(exercise.sets);
        return (
          <View
            key={exercise.id}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "gray" }}>
              {exercise.sets.length} x {exercise.name}
            </Text>

            {bestSet && (
              <Text style={{ color: "gray" }}>
                {bestSet?.reps}{" "}
                {bestSet?.weight ? `x ${bestSet.weight} kg` : "reps"}
              </Text>
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
