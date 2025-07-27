import CustomButton from "@/components/atoms/CustomButton";
import { Text, TextInput, View } from "@/components/atoms/Themed";
import { ExerciseSet } from "@/types/models";
import React, { useState } from "react";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Feather from "@expo/vector-icons/Feather";
import { Button } from "react-native";

type SetItem = {
  index: number;
  set: ExerciseSet;
};

export default function SetItem({ index, set }: SetItem) {
  const [weight, setWeight] = useState(set.weight?.toString() || undefined);
  const [reps, setReps] = useState(set.reps?.toString() || undefined);

  const handleWeightChange = () => {
    console.warn("Weight changed to: ", weight);
  };

  const handleRepsChange = () => {
    console.warn("Reps changed to: ", reps);
  };

  const renderRightActions = () => (
    <View
      style={{
        width: "auto",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 10,
      }}
    >
      <Feather
        name="trash-2"
        size={24}
        color="crimson"
        onPress={() => console.log("Deleting set: ", set.id)}
      />
    </View>
  );

  // const renderRightActions = () => (
  //   <View
  //     style={{
  //       backgroundColor: "crimson",
  //       justifyContent: "center",
  //       alignItems: "center",
  //       width: 80,
  //     }}
  //   >
  //     <CustomButton
  //       title="Delete"
  //       type="link"
  //       color="white"
  //       style={{ padding: 5 }}
  //     />
  //   </View>
  // );
  return (
    <ReanimatedSwipeable renderRightActions={renderRightActions}>
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
          onBlur={handleWeightChange}
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
          onBlur={handleRepsChange}
          keyboardType="numeric"
        />
      </View>
    </ReanimatedSwipeable>
  );
}
