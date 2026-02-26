import { Pressable, Text, ActivityIndicator, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/shared/theme/useTheme';
import { createStyles } from '@/shared/theme/createStyles';
import { useHaptic } from '@/shared/hooks/useHaptic';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'default' | 'small';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const { colors, animations } = useTheme();
  const styles = useStyles();
  const haptic = useHaptic();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(animations.card.pressScale, animations.springs.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, animations.springs.snappy);
  };

  const handlePress = () => {
    if (loading || disabled) return;
    haptic.medium();
    onPress();
  };

  const bgColor =
    variant === 'primary' ? colors.accent.primary :
    variant === 'danger' ? colors.semantic.error.main :
    variant === 'secondary' ? 'transparent' :
    'transparent';

  const textColor =
    variant === 'primary' ? colors.text.inverse :
    variant === 'danger' ? colors.text.inverse :
    variant === 'secondary' ? colors.accent.primary :
    colors.text.accent;

  const borderStyle: ViewStyle =
    variant === 'secondary'
      ? { borderWidth: 1, borderColor: colors.accent.border }
      : {};

  return (
    <AnimatedPressable
      style={[
        styles.base,
        size === 'small' && styles.small,
        { backgroundColor: bgColor },
        borderStyle,
        (loading || disabled) && styles.disabled,
        animStyle,
        style,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </AnimatedPressable>
  );
}

const useStyles = createStyles((t) => ({
  base: {
    height: 52,
    borderRadius: t.radius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 24,
  },
  small: {
    height: 40,
    paddingHorizontal: 16,
  },
  text: {
    fontFamily: t.typography.bodyLg.fontFamily,
    fontWeight: t.typography.bodyLg.fontWeight,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
}));
