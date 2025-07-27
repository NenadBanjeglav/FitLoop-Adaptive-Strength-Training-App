// components/atoms/MuscleBadge.tsx

import { Text, View } from "../atoms/Themed";

type Props = {
  label: string;
  type?: "primary" | "secondary";
};

export default function MuscleBadge({ label, type = "primary" }: Props) {
  const backgroundColor = type === "primary" ? "#d1e7ff" : "#ffe8cc";
  const color = type === "primary" ? "#0056b3" : "#cc6600";

  return (
    <View
      style={{
        backgroundColor,
        borderRadius: 12,
        paddingVertical: 2,
        paddingHorizontal: 8,
        marginRight: 6,
        marginBottom: 4,
      }}
    >
      <Text style={{ fontSize: 12, color, fontWeight: "500" }}>{label}</Text>
    </View>
  );
}
