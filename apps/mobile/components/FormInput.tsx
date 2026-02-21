import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme';

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
    width: '100%',
  },
  label: {
    fontSize: 13,
    color: colors.brand.muted,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  inputWrapper: {
    backgroundColor: colors.brand.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.brand.border,
    minHeight: 54,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
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
    textAlignVertical: 'top',
    minHeight: 100,
  },
  inputError: {
    borderColor: colors.semantic.danger,
  },
  error: {
    marginTop: spacing.xs,
    color: colors.semantic.danger,
    fontSize: 12,
  },
});

export default FormInput;
