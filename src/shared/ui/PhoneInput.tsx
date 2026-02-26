import { useState, useCallback } from 'react';
import { View, Text, TextInput, type NativeSyntheticEvent, type TextInputKeyPressEventData } from 'react-native';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { LAYOUT } from '@/shared/theme/types';

interface PhoneInputProps {
  value: string;
  onChangeText: (phone: string) => void;
  error?: string;
  autoFocus?: boolean;
}

/**
 * Format 10 raw digits into (___) ___-__-__
 */
function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 10);
  if (d.length === 0) return '';
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  if (d.length <= 8) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8)}`;
}

export function PhoneInput({ value, onChangeText, error, autoFocus }: PhoneInputProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const [focused, setFocused] = useState(false);

  const formatted = formatPhone(value);

  const handleChange = useCallback(
    (text: string) => {
      // Strip everything except digits from the formatted portion (after +7)
      const digits = text.replace(/\D/g, '').slice(0, 10);
      onChangeText(digits);
    },
    [onChangeText],
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.row,
          focused && { borderColor: colors.accent.primary },
          error ? { borderColor: colors.semantic.error.main } : undefined,
        ]}
      >
        <Text style={styles.prefix}>+7</Text>
        <TextInput
          style={styles.input}
          value={formatted}
          onChangeText={handleChange}
          placeholder="(900) 123-45-67"
          placeholderTextColor={colors.text.tertiary}
          keyboardType="number-pad"
          maxLength={15} // formatted max: (999) 999-99-99 = 15 chars
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="tel"
          textContentType="telephoneNumber"
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  container: { gap: 6 },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    height: LAYOUT.input.height,
    borderWidth: 1,
    borderColor: t.colors.border.default,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.bg.elevated,
    paddingHorizontal: 16,
  },
  prefix: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    marginRight: 4,
  },
  input: {
    flex: 1,
    height: '100%' as unknown as number,
    ...t.typography.body,
    color: t.colors.text.primary,
    padding: 0,
  },
  error: {
    ...t.typography.caption,
    color: t.colors.semantic.error.main,
  },
}));
