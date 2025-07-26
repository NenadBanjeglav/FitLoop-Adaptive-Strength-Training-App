import { Text, TextInput, View } from "@/components/atoms/Themed";
import { ExerciseSet } from "@/types/models";
import React from "react";

type SetItem = {
  index: number;
  set: ExerciseSet;
};

export default function SetItem({ index }: SetItem) {
  return (
    <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
      <Text style={{ marginRight: "auto", fontWeight: "bold" }}>
        {index + 1}
      </Text>
      <TextInput
        style={{
          width: 60,
          padding: 5,
          paddingVertical: 7,
          fontSize: 16,
          textAlign: "center",
        }}
        placeholder="50"
      />
      <TextInput
        style={{
          width: 60,
          padding: 5,
          paddingVertical: 7,
          fontSize: 16,
          textAlign: "center",
        }}
        placeholder="8"
      />
    </View>
  );
}
