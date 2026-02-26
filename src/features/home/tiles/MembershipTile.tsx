import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Badge, Skeleton } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { SPACING } from '@/shared/theme/types';
import type { DashboardData } from '../hooks';

interface Props {
  data: DashboardData['membership'];
  isLoading: boolean;
}

export function MembershipTile({ data, isLoading }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const haptic = useHaptic();
  const router = useRouter();

  if (isLoading) {
    return <Skeleton variant="tile" style={styles.skeleton} />;
  }

  const handlePress = () => {
    haptic.light();
    router.push('/(client)/(more)');
  };

  if (!data) {
    return (
      <Card style={styles.tile}>
        <Text style={styles.emptyText}>Нет абонемента</Text>
      </Card>
    );
  }

  const progress = data.totalVisits > 0 ? data.remainingVisits / data.totalVisits : 0;
  const validDate = new Date(data.validUntil).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card style={styles.tile} onPress={handlePress}>
      <Badge text={data.name} variant="accent" />
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
        <Text style={styles.progressText}>
          {data.remainingVisits}/{data.totalVisits}
        </Text>
      </View>
      <Text style={styles.caption}>
        До {validDate}
      </Text>
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
  progressText: {
    ...t.typography.caption,
    color: t.colors.text.secondary,
    marginTop: SPACING[1],
    textAlign: 'right' as const,
  },
  caption: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
    marginTop: SPACING[1],
  },
}));
