import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from "react-native";
import { colors, radius, spacing } from "../theme";

type Props = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle | ViewStyle[];
};

export function FormInput({ label, error, containerStyle, ...rest }: Props) {
  return (
    <View style={[styles.container, containerStyle as any]}>
      {!!label && (
        <Text accessibilityRole="text" style={styles.label}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          (rest as any).multiline ? styles.textareaWrapper : undefined,
          !!error && styles.inputError,
        ]}
      >
        <TextInput
          placeholderTextColor={colors.brand.muted}
          style={[styles.input, (rest as any).multiline ? styles.textarea : undefined]}
          {...rest}
        />
      </View>
      {!!error && (
        <Text accessibilityRole="text" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: colors.brand.muted,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
    shadowColor: colors.shadow.brand.color,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  input: {
    fontSize: 16,
    color: colors.brand.text,
  },
  textareaWrapper: {
    minHeight: 120,
    paddingVertical: spacing.sm,
  },
  textarea: {
    textAlignVertical: "top",
    minHeight: 100,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  error: {
    marginTop: spacing.xs,
    color: "#EF4444",
  },
});

export default FormInput;
