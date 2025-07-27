// app/workout/select-exercise.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Text, TextInput, View } from "@/components/atoms/Themed";

import { Exercise } from "@/types/models";
import { getPaginatedExercises } from "@/utils";

import ExerciseItem from "@/components/molecules/ExerciseItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SelectExerciseScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [search, setSearch] = useState("");
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMoreExercises = () => {
    if (nextCursor === null) return;

    const result = getPaginatedExercises(nextCursor, search);
    setExercisesList((prev) => [...prev, ...result.data]);
    setNextCursor(result.nextCursor);
  };

  useEffect(() => {
    setLoading(true);
    const result = getPaginatedExercises(0, search);
    setExercisesList(result.data);
    setNextCursor(result.nextCursor);
    setLoading(false);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [search]);

  const handleSelect = (exerciseName: string) => {
    console.log("Selected:", exerciseName);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingHorizontal: 20,
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ position: "relative", marginTop: 12 }}>
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
