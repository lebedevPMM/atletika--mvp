import { useEffect } from 'react';
import { type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { createStyles } from '@/shared/theme/createStyles';

interface SkeletonProps {
  variant?: 'card' | 'list' | 'tile';
  style?: ViewStyle;
}

export function Skeleton({ variant = 'card', style }: SkeletonProps) {
  const styles = useStyles();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const variantStyle =
    variant === 'card' ? styles.card :
    variant === 'list' ? styles.list :
    styles.tile;

  return <Animated.View style={[styles.base, variantStyle, animStyle, style]} />;
}

const useStyles = createStyles((t) => ({
  base: {
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.md,
  },
  card: { height: 120, width: '100%' as unknown as number },
  list: { height: 60, width: '100%' as unknown as number },
  tile: { height: 80, width: 80 },
}));
