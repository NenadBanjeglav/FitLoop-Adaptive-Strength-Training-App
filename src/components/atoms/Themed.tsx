import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  TextInput as RNTextInput,
  useColorScheme,
} from "react-native";

import Colors from "@/constants/colors";
import React from "react";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

// export function TextInput(props: TextInputProps) {
//   const { style, lightColor, darkColor, ...otherProps } = props;
//   const backgroundColor = useThemeColor(
//     { light: lightColor, dark: darkColor },
//     "textInputBackground"
//   );
//   const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

//   return (
//     <DefaultTextInput
//       style={[{ backgroundColor, color }, style]}
//       {...otherProps}
//     />
//   );
// }

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  ({ style, lightColor, darkColor, ...otherProps }, ref) => {
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "textInputBackground"
    );
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return (
      <DefaultTextInput
        ref={ref} // ✅ forwarded ref here
        style={[{ backgroundColor, color }, style]}
        {...otherProps}
      />
    );
  }
);
