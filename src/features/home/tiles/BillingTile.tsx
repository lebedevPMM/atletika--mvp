import { View, Text } from 'react-native';
import { Card, Skeleton } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { SPACING } from '@/shared/theme/types';
import { pluralize } from '@/shared/lib/pluralize';
import type { DashboardData } from '../hooks';

interface Props {
  data: DashboardData['billing'];
  isLoading: boolean;
}

export function BillingTile({ data, isLoading }: Props) {
  const styles = useStyles();
  const haptic = useHaptic();

  if (isLoading) {
    return <Skeleton variant="tile" style={styles.skeleton} />;
  }

  const handlePress = () => {
    haptic.light();
    // TODO: navigate to billing
  };

  if (!data || data.openInvoices === 0) {
    return (
      <Card style={styles.tile} onPress={handlePress}>
        <Text style={styles.label}>Счета</Text>
        <View style={styles.okRow}>
          <Text style={styles.checkmark}>✅</Text>
          <Text style={styles.okText}>Нет счетов</Text>
        </View>
      </Card>
    );
  }

  const formatted = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: data.currency,
    minimumFractionDigits: 0,
  }).format(data.totalDue);

  return (
    <Card style={styles.tile} onPress={handlePress}>
      <Text style={styles.label}>К оплате</Text>
      <Text style={styles.amount}>{formatted}</Text>
      <Text style={styles.caption}>
        {data.openInvoices} {pluralize(data.openInvoices, ['счёт', 'счёта', 'счётов'])}
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
  label: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  amount: {
    ...t.typography.h4,
    color: t.colors.text.primary,
    marginTop: SPACING[1],
  },
  caption: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
    marginTop: SPACING[1],
  },
  okRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: SPACING[2],
    gap: SPACING[2],
  },
  checkmark: {
    fontSize: 20,
  },
  okText: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
}));
