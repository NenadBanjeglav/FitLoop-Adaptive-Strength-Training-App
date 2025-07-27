import Card from "@/components/atoms/Card";
import CustomButton from "@/components/atoms/CustomButton";
import { Text, TextInput, View } from "@/components/atoms/Themed";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Exercise } from "@/types/models";
import { getPaginatedExercises } from "@/utils";

type SelectExerciseModal = {
  onSelectExercise: (name: string) => void;
};

export default function SelectExerciseModal({
  onSelectExercise,
}: SelectExerciseModal) {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const [cursor, setCursor] = useState(0);
  const [nextCursor, setNextCursor] = useState<number | null>(null);

  const loadMoreExercises = () => {
    if (nextCursor === null) return;

    const result = getPaginatedExercises(nextCursor, search);
    setExercisesList((prev) => [...prev, ...result.data]);
    setCursor(nextCursor);
    setNextCursor(result.nextCursor);
  };

  useEffect(() => {
    if (!open) return;
    const result = getPaginatedExercises(0, search);
    setExercisesList(result.data);
    setCursor(0);
    setNextCursor(result.nextCursor);
  }, [search, open]);

  return (
    <>
      <CustomButton
        onPress={() => setOpen(true)}
        title="Select Exercise"
        style={{ marginBottom: 10 }}
      />
      <Modal visible={open} transparent={true}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80}
        >
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.8)",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Card
              style={{ width: "90%", height: "80%" }}
              title="Select Exercise"
            >
              <AntDesign
                style={{ position: "absolute", right: 20, top: 20 }}
                name="close"
                size={24}
                color="black"
                onPress={() => setOpen(false)}
              />

              <TextInput
                placeholder="Search..."
                value={search}
                onChangeText={setSearch}
                style={{ padding: 10, marginVertical: 10 }}
              />

              <FlatList
                contentContainerStyle={{ gap: 20 }}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item) => item.exerciseId || item.name}
                onEndReached={loadMoreExercises}
                onEndReachedThreshold={0.5}
                data={exercisesList}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      onSelectExercise(item.name);
                      setOpen(false);
                    }}
                    style={{ gap: 3 }}
                  >
                    <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                    <Text>{item.targetMuscles?.join(", ")}</Text>
                  </Pressable>
                )}
                ListFooterComponent={
                  nextCursor ? (
                    <Text style={{ textAlign: "center", marginVertical: 10 }}>
                      Loading more...
                    </Text>
                  ) : null
                }
                bounces={false}
              />
            </Card>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
