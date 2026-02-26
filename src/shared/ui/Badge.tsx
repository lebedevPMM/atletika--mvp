import { View, Text } from 'react-native';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';

interface BadgeProps {
  text: string;
  variant?: 'accent' | 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ text, variant = 'accent' }: BadgeProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  const bgColor =
    variant === 'accent' ? colors.accent.primary :
    variant === 'success' ? colors.semantic.success.main :
    variant === 'warning' ? colors.semantic.warning.main :
    variant === 'error' ? colors.semantic.error.main :
    colors.semantic.info.main;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: t.radius.sm,
    alignSelf: 'flex-start' as const,
  },
  text: {
    ...t.typography.caption,
    color: t.colors.text.inverse,
    fontWeight: '600' as const,
  },
}));
