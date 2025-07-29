import React, { memo } from "react";
import { Pressable, Image } from "react-native";
import { Text, View } from "@/components/atoms/Themed";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Exercise } from "@/types/models";

import { capitalizeWords } from "@/utils";
import MuscleBadge from "./MuscleBadge";

type Props = {
  item: Exercise;
  onSelect: (name: string) => void;
};

const ExerciseItem = ({ item, onSelect }: Props) => (
  <Pressable
    onPress={() => {
      onSelect(item.name);
    }}
    style={({ pressed }) => [
      {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: pressed ? "#f2f2f2" : "#fff",
        padding: 12,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 10,
      },
    ]}
  >
    {item.gifUrl && (
      <Image
        source={{ uri: item.gifUrl }}
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          marginRight: 12,
        }}
        resizeMode="cover"
      />
    )}

    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {capitalizeWords(item.name)}
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
          {item.targetMuscles?.map((muscle) => (
            <MuscleBadge key={muscle} label={muscle} type="primary" />
          ))}
        </View>

        {/* Secondary Muscles */}
        {item.secondaryMuscles?.length > 0 && (
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 2 }}
          >
            {item.secondaryMuscles.map((muscle) => (
              <MuscleBadge key={muscle} label={muscle} type="secondary" />
            ))}
          </View>
        )}
      </View>

      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          router.push(`/exercise/${item.exerciseId}`);
        }}
        style={{
          padding: 8,
          marginLeft: 8,
        }}
        hitSlop={50}
      >
        <Ionicons name="information-circle-outline" size={22} color="#555" />
      </Pressable>
    </View>
  </Pressable>
);

export default memo(ExerciseItem);
