import { View } from 'react-native';
import { createStyles } from '@/shared/theme/createStyles';

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
}

export function ProgressBar({ current, total, color }: ProgressBarProps) {
  const styles = useStyles();
  const progress = total > 0 ? Math.min(current / total, 1) : 0;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

const useStyles = createStyles((t) => ({
  track: {
    height: 6,
    backgroundColor: t.colors.bg.elevated,
    borderRadius: 3,
    overflow: 'hidden' as const,
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
}));
