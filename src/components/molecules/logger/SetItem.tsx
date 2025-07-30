import { Text, TextInput, View } from "@/components/atoms/Themed";
import { ExerciseSet } from "@/types/models";
import React, { useEffect, useRef, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { useWorkouts } from "@/store";
import { Alert } from "react-native";
import { TextInput as RNTextInput } from "react-native";

type SetItem = {
  index: number;
  set: ExerciseSet;
};

export default function SetItem({
  index,
  set,
  autoFocus = false,
}: SetItem & { autoFocus?: boolean }) {
  const weightRef = useRef<RNTextInput>(null);
  const [weight, setWeight] = useState(set.weight?.toString() || undefined);
  const [reps, setReps] = useState(set.reps?.toString() || undefined);

  const updateSet = useWorkouts((state) => state.updateSet);
  const deleteSet = useWorkouts((state) => state.deleteSet);

  useEffect(() => {
    if (autoFocus && weightRef.current) {
      const timeout = setTimeout(() => {
        weightRef.current?.focus();
      }, 250); // try between 150–300ms if it feels off

      return () => clearTimeout(timeout);
    }
  }, [autoFocus]);

  const handleWeightChange = () => {
    const parsed = parseFloat(weight || "");
    if (!isNaN(parsed)) {
      updateSet(set.id, { weight: parsed });
    }
  };

  const handleRepsChange = () => {
    const parsed = parseInt(reps || "", 10);
    if (!isNaN(parsed)) {
      updateSet(set.id, { reps: parsed });
    }
  };

  const confirmDelete = () => {
    Alert.alert("Delete Set", "Are you sure you want to delete this set?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteSet(set.id),
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ marginRight: "auto", fontWeight: "bold" }}>
          {index + 1}
        </Text>
        <TextInput
          ref={weightRef}
          style={{
            width: 60,
            padding: 5,
            paddingVertical: 7,
            fontSize: 16,
            textAlign: "center",
          }}
          placeholder="--"
          value={weight}
          placeholderTextColor="lightgray"
          onChangeText={setWeight}
          onEndEditing={handleWeightChange}
          keyboardType="numeric"
        />
        <TextInput
          style={{
            width: 60,
            padding: 5,
            paddingVertical: 7,
            fontSize: 16,
            textAlign: "center",
          }}
          placeholder="--"
          value={reps}
          placeholderTextColor="lightgray"
          onChangeText={setReps}
          onEndEditing={handleRepsChange}
          keyboardType="numeric"
        />
        <Feather
          name="trash-2"
          size={20}
          color="crimson"
          onPress={confirmDelete}
          style={{ marginLeft: 8, padding: 5 }}
        />
      </View>
    </View>
  );
}
