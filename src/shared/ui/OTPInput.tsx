import { useRef, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Pressable,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  error?: boolean;
}

export function OTPInput({ length = 4, onComplete, error = false }: OTPInputProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const refs = useRef<(TextInput | null)[]>(Array(length).fill(null));

  const focusAt = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, length - 1));
      refs.current[clamped]?.focus();
    },
    [length],
  );

  const handleChange = useCallback(
    (text: string, index: number) => {
      const cleaned = text.replace(/\D/g, '');

      // Handle paste (multiple digits at once)
      if (cleaned.length > 1) {
        const pasteDigits = cleaned.slice(0, length).split('');
        const newDigits = [...digits];
        pasteDigits.forEach((d, i) => {
          if (index + i < length) newDigits[index + i] = d;
        });
        setDigits(newDigits);

        const nextIndex = Math.min(index + pasteDigits.length, length - 1);
        focusAt(nextIndex);

        // Check completion
        if (newDigits.every((d) => d !== '')) {
          onComplete(newDigits.join(''));
        }
        return;
      }

      // Single digit
      const newDigits = [...digits];
      newDigits[index] = cleaned;
      setDigits(newDigits);

      if (cleaned && index < length - 1) {
        focusAt(index + 1);
      }

      // Check completion
      if (cleaned && newDigits.every((d) => d !== '')) {
        onComplete(newDigits.join(''));
      }
    },
    [digits, length, focusAt, onComplete],
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === 'Backspace') {
        if (digits[index] === '' && index > 0) {
          // Current is empty => clear previous and move back
          const newDigits = [...digits];
          newDigits[index - 1] = '';
          setDigits(newDigits);
          focusAt(index - 1);
        } else {
          // Clear current
          const newDigits = [...digits];
          newDigits[index] = '';
          setDigits(newDigits);
        }
      }
    },
    [digits, focusAt],
  );

  /** Reset all digits (useful when retrying) */
  const reset = useCallback(() => {
    setDigits(Array(length).fill(''));
    focusAt(0);
  }, [length, focusAt]);

  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, i) => {
        const isFocused = focusedIndex === i;
        const isFilled = digits[i] !== '';

        return (
          <TextInput
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            style={[
              styles.box,
              isFocused && { borderColor: colors.accent.primary },
              isFilled && {
                borderColor: colors.accent.primary,
                backgroundColor: colors.accent.surface,
              },
              error && { borderColor: colors.semantic.error.main },
            ]}
            value={digits[i]}
            onChangeText={(text) => handleChange(text, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            onFocus={() => setFocusedIndex(i)}
            keyboardType="number-pad"
            maxLength={i === 0 ? length : 1} // first box accepts paste
            textContentType="oneTimeCode"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            selectTextOnFocus
            caretHidden
          />
        );
      })}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  row: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 12,
  },
  box: {
    width: 56,
    height: 56,
    borderWidth: 1.5,
    borderColor: t.colors.border.default,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.bg.elevated,
    textAlign: 'center' as const,
    ...t.typography.h2,
    color: t.colors.text.primary,
  },
}));
