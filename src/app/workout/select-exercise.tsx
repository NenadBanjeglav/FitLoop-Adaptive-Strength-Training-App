// app/workout/select-exercise.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { Text, TextInput, View } from "@/components/atoms/Themed";

import { Exercise } from "@/types/models";
import { getPaginatedExercises } from "@/utils";

import ExerciseItem from "@/components/molecules/exercise/ExerciseItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useWorkouts } from "@/store";
import targetMuscles from "@/data/targetMuscles";
import exercises from "@/data/exercises";
import equipments from "@/data/equipments";

export default function SelectExerciseScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [search, setSearch] = useState("");
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);

  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);

  const loadMoreExercises = () => {
    if (nextCursor === null) return;

    const result = getPaginatedExercises(nextCursor, search);
    setExercisesList((prev) => [...prev, ...result.data]);
    setNextCursor(result.nextCursor);
  };

  useEffect(() => {
    const filtered = exercises.filter((exercise) => {
      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesTarget =
        selectedTargets.length === 0 ||
        selectedTargets.some((target) =>
          exercise.targetMuscles.includes(target)
        );

      const matchesEquipment =
        selectedEquipments.length === 0 ||
        selectedEquipments.some((eq) => exercise.equipments.includes(eq));

      return matchesSearch && matchesTarget && matchesEquipment;
    });

    setExercisesList(filtered);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [search, selectedTargets, selectedEquipments]);

  const addExercise = useWorkouts((state) => state.addExercise);

  const handleSelect = (exerciseName: string) => {
    const selected = exercisesList.find((e) => e.name === exerciseName);
    if (!selected) return;

    addExercise(selected);
    router.back();
  };

  const toggleTarget = (muscle: string) => {
    if (selectedTargets.includes(muscle)) {
      setSelectedTargets(selectedTargets.filter((m) => m !== muscle));
    } else {
      setSelectedTargets([...selectedTargets, muscle]);
    }
  };

  const toggleEquipment = (equipment: string) => {
    if (selectedEquipments.includes(equipment)) {
      setSelectedEquipments(selectedEquipments.filter((e) => e !== equipment));
    } else {
      setSelectedEquipments([...selectedEquipments, equipment]);
    }
  };

  const clearFilters = () => {
    setSelectedTargets([]);
    setSelectedEquipments([]);
    setSearch("");
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <SafeAreaView style={{ flex: 1, marginTop: -30 }}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingHorizontal: 20,
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ gap: 10, marginVertical: 12 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Target Muscle
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {targetMuscles.map((target) => {
              const selected = selectedTargets.includes(target.name);
              return (
                <Pressable
                  key={target.name}
                  onPress={() => toggleTarget(target.name)}
                  style={{
                    backgroundColor: selected ? "#007AFF" : "#eee",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{
                      color: selected ? "white" : "#333",
                      fontWeight: "500",
                    }}
                  >
                    {target.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ gap: 10, marginBottom: 12 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Equipment</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {equipments.map((equipment) => {
              const selected = selectedEquipments.includes(equipment.name);
              return (
                <Pressable
                  key={equipment.name}
                  onPress={() => toggleEquipment(equipment.name)}
                  style={{
                    backgroundColor: selected ? "#34C759" : "#eee",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{
                      color: selected ? "white" : "#333",
                      fontWeight: "500",
                    }}
                  >
                    {equipment.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ position: "relative", marginVertical: 20 }}>
          <TextInput
            placeholder="Search exercises..."
            value={search}
            onChangeText={setSearch}
            style={{
              padding: 10,
              paddingRight: 32, // reserve space for icon
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ccc",
              backgroundColor: "#f9f9f9",
            }}
          />
          {search.length > 0 && (
            <Pressable
              onPress={() => setSearch("")}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: [{ translateY: -10 }],
              }}
              hitSlop={10}
            >
              <Ionicons name="close-circle" size={20} color="#888" />
            </Pressable>
          )}
        </View>

        {(selectedTargets.length > 0 ||
          selectedEquipments.length > 0 ||
          search.length > 0) && (
          <Pressable
            onPress={clearFilters}
            style={{
              alignSelf: "center",
              marginBottom: 10,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              backgroundColor: "#FF3B30",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              Clear Filters
            </Text>
          </Pressable>
        )}

        <FlatList
          ref={flatListRef}
          data={exercisesList}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          keyExtractor={(item) => item.exerciseId || item.name}
          renderItem={({ item }) => (
            <ExerciseItem item={item} onSelect={handleSelect} />
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "gray", marginTop: 40 }}>
              No exercises found.
            </Text>
          }
          onEndReached={loadMoreExercises}
          onEndReachedThreshold={0.5}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
