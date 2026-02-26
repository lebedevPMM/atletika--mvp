import { Text } from 'react-native';
import { Card } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { SPACING } from '@/shared/theme/types';
import type { DashboardData } from '../hooks';

interface Props {
  data: DashboardData['promos'][number];
}

export function PromoCard({ data }: Props) {
  const styles = useStyles();
  const haptic = useHaptic();

  const handlePress = () => {
    haptic.light();
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Text style={styles.title} numberOfLines={1}>
        {data.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {data.description}
      </Text>
    </Card>
  );
}

const useStyles = createStyles((t) => ({
  card: {
    width: 240,
    minHeight: 90,
    justifyContent: 'center' as const,
    backgroundColor: t.colors.accent.surface,
  },
  title: {
    ...t.typography.bodyLg,
    fontWeight: '700' as const,
    color: t.colors.text.primary,
  },
  description: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    marginTop: SPACING[1],
  },
}));
