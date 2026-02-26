import { useState, type Ref } from 'react';
import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { LAYOUT } from '@/shared/theme/types';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  inputRef?: Ref<TextInput>;
}

export function Input({ label, error, inputRef, style, ...props }: InputProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          focused && { borderColor: colors.accent.primary },
          error ? { borderColor: colors.semantic.error.main } : undefined,
          style,
        ]}
        placeholderTextColor={colors.text.tertiary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  container: { gap: 6 },
  label: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  input: {
    height: LAYOUT.input.height,
    borderWidth: 1,
    borderColor: t.colors.border.default,
    borderRadius: t.radius.md,
    paddingHorizontal: 16,
    color: t.colors.text.primary,
    backgroundColor: t.colors.bg.elevated,
    ...t.typography.body,
  },
  error: {
    ...t.typography.caption,
    color: t.colors.semantic.error.main,
  },
}));
