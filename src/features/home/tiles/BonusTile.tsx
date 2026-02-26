import { View, Text } from 'react-native';
import { Card, Badge, Skeleton } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { SPACING } from '@/shared/theme/types';
import type { DashboardData } from '../hooks';

interface Props {
  data: DashboardData['bonus'];
  isLoading: boolean;
}

export function BonusTile({ data, isLoading }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const haptic = useHaptic();

  if (isLoading) {
    return <Skeleton variant="tile" style={styles.skeleton} />;
  }

  const handlePress = () => {
    haptic.light();
    // TODO: navigate to bonuses
  };

  if (!data) {
    return (
      <Card style={styles.tile}>
        <Text style={styles.emptyText}>Бонусы недоступны</Text>
      </Card>
    );
  }

  const total = data.balance + data.pointsToNext;
  const progress = total > 0 ? data.balance / total : 0;

  return (
    <Card style={styles.tile} onPress={handlePress}>
      <Text style={styles.balance}>{data.balance.toLocaleString('ru-RU')}</Text>
      <Badge text={data.level} variant="warning" />
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.round(progress * 100)}%` as unknown as number,
                backgroundColor: colors.accent.primary,
              },
            ]}
          />
        </View>
        <Text style={styles.nextLevel}>
          {data.pointsToNext} до {data.nextLevel}
        </Text>
      </View>
    </Card>
  );
}

const useStyles = createStyles((t) => ({
  tile: {
    width: '48%' as unknown as number,
    minHeight: 130,
    justifyContent: 'space-between' as const,
  },
  skeleton: {
    width: '48%' as unknown as number,
    height: 130,
  },
  emptyText: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  balance: {
    ...t.typography.h3,
    color: t.colors.text.primary,
  },
  progressContainer: {
    marginTop: SPACING[2],
  },
  progressBg: {
    height: 6,
    backgroundColor: t.colors.bg.sunken,
    borderRadius: t.radius.full,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: 6,
    borderRadius: t.radius.full,
  },
  nextLevel: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
    marginTop: SPACING[1],
  },
}));
