import { Text, View } from "@/components/atoms/Themed";
import { calculateDuration } from "@/utils";
import React, { useEffect, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useWorkouts } from "@/store";

export default function WorkoutHeader() {
  const [timer, setTimer] = useState("0:00:00");

  const workout = useWorkouts((state) => state.currentWorkout);

  useEffect(() => {
    const interval = setInterval(() => {
      const duration = calculateDuration(
        new Date(workout!.createdAt),
        new Date()
      );
      setTimer(duration);
    }, 1000);

    return () => clearInterval(interval);
  }, [workout]);

  return (
    <View
      style={{
        gap: 10,
        backgroundColor: "transparent",
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 24 }}>Workout tracker</Text>
      <Text style={{ fontSize: 18 }}>
        <FontAwesome5 name="clock" size={18} color="gray" /> {timer}
      </Text>
    </View>
  );
}
