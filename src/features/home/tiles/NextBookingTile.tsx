import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/shared/ui';
import { Badge } from '@/shared/ui';
import { Skeleton } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { SPACING } from '@/shared/theme/types';
import type { DashboardData } from '../hooks';

interface Props {
  data: DashboardData['nextBooking'];
  isLoading: boolean;
}

export function NextBookingTile({ data, isLoading }: Props) {
  const styles = useStyles();
  const haptic = useHaptic();
  const router = useRouter();

  if (isLoading) {
    return <Skeleton variant="tile" style={styles.skeleton} />;
  }

  const handlePress = () => {
    haptic.light();
    // TODO: navigate to booking details
  };

  if (!data) {
    return (
      <Card style={styles.tile} onPress={() => router.push('/(client)/(booking)')}>
        <Text style={styles.emptyText}>Нет записей</Text>
        <Button
          title="Записаться"
          variant="ghost"
          size="small"
          onPress={() => router.push('/(client)/(booking)')}
        />
      </Card>
    );
  }

  const dateStr = new Date(data.date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <Card style={styles.tile} onPress={handlePress}>
      <Text style={styles.label} numberOfLines={1}>
        {data.title}
      </Text>
      <Text style={styles.time}>
        {dateStr}, {data.time}
      </Text>
      <Text style={styles.caption} numberOfLines={1}>
        {data.trainer}
      </Text>
      <Badge text={data.room} variant="info" />
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
  label: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  time: {
    ...t.typography.h4,
    color: t.colors.text.primary,
    marginTop: SPACING[1],
  },
  caption: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
    marginTop: SPACING[1],
  },
  emptyText: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    marginBottom: SPACING[2],
  },
}));
