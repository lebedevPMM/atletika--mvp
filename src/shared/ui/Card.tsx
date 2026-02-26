import { View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Pressable } from 'react-native-gesture-handler';
import { useTheme } from '@/shared/theme/useTheme';
import { createStyles } from '@/shared/theme/createStyles';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Card({ children, onPress, style }: CardProps) {
  const { animations } = useTheme();
  const styles = useStyles();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!onPress) {
    return <View style={[styles.card, style]}>{children}</View>;
  }

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(animations.card.pressScale, animations.springs.snappy);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, animations.springs.snappy);
        }}
        onPress={onPress}
        style={[styles.card, style]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const useStyles = createStyles((t) => ({
  card: {
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    padding: 16,
    ...t.elevation[1],
  },
}));
