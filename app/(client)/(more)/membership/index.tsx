import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMembership } from '@/features/membership/hooks';
import type { MembershipStatus } from '@/features/membership/types';
import { getMembershipStatusText, getDaysLeftColor, formatVisitsProgress } from '@/features/membership/utils';
import { pluralize } from '@/shared/lib/pluralize';
import { Card, Badge, Button, ProgressBar, Skeleton, EmptyState, ErrorState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING } from '@/shared/theme/types';

function statusBadge(status: MembershipStatus): { text: string; variant: 'success' | 'error' | 'info' | 'warning' } {
  const text = getMembershipStatusText(status);
  const variantMap: Record<MembershipStatus, 'success' | 'error' | 'info' | 'warning'> = {
    active: 'success',
    expired: 'error',
    frozen: 'info',
    none: 'warning',
  };
  return { text, variant: variantMap[status] };
}

function LoadingSkeleton() {
  const styles = useStyles();
  return (
    <View style={styles.content}>
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} variant="list" style={{ height: 80 }} />
      ))}
    </View>
  );
}

export default function MembershipScreen() {
  useScreenView('client_membership');
  const styles = useStyles();
  const router = useRouter();
  const { colors } = useTheme();
  const { data: membership, isLoading, isError, refetch } = useMembership();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backButton}>{'<'} Назад</Text>
          </Pressable>
          <Text style={styles.title}>Мой тариф</Text>
        </View>
        <LoadingSkeleton />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backButton}>{'<'} Назад</Text>
          </Pressable>
          <Text style={styles.title}>Мой тариф</Text>
        </View>
        <ErrorState message="Не удалось загрузить информацию о тарифе" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  if (!membership || membership.status === 'none') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backButton}>{'<'} Назад</Text>
          </Pressable>
          <Text style={styles.title}>Мой тариф</Text>
        </View>
        <EmptyState
          icon="🏅"
          title="Нет активного тарифа"
          subtitle="Выберите подходящий тариф в каталоге"
          actionTitle="Открыть каталог"
          onAction={() => router.push('/(client)/(more)/catalog')}
        />
      </SafeAreaView>
    );
  }

  const badge = statusBadge(membership.status);
  const totalDays = Math.round(
    (new Date(membership.endDate).getTime() - new Date(membership.startDate).getTime()) / 86400000,
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backButton}>{'<'} Назад</Text>
          </Pressable>
          <Text style={styles.title}>Мой тариф</Text>
        </View>

        {/* Plan name + status */}
        <Card style={styles.planCard}>
          <View style={styles.planRow}>
            <Text style={styles.planName}>{membership.planName}</Text>
            <Badge text={badge.text} variant={badge.variant} />
          </View>
          {membership.debtFlag && (
            <View style={styles.debtBanner}>
              <Text style={styles.debtText}>⚠️ Есть задолженность</Text>
            </View>
          )}
        </Card>

        {/* Days left */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Срок действия</Text>
          <View style={styles.daysRow}>
            <Text style={styles.daysNumber}>{membership.daysLeft}</Text>
            <Text style={styles.daysLabel}>
              {pluralize(membership.daysLeft, ['день', 'дня', 'дней'])} осталось
            </Text>
          </View>
          <ProgressBar
            current={membership.daysLeft}
            total={totalDays}
            color={colors.semantic[getDaysLeftColor(membership.daysLeft)].main}
          />
        </Card>

        {/* Limits: visits + PT */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Лимиты</Text>

          {/* Visits */}
          <View style={styles.limitRow}>
            <Text style={styles.limitLabel}>Посещения</Text>
            <Text style={styles.limitValue}>
              {formatVisitsProgress(membership.visitsLeft, membership.visitsTotal)}
            </Text>
          </View>
          {membership.visitsLeft !== null && membership.visitsTotal !== null && (
            <ProgressBar
              current={membership.visitsLeft}
              total={membership.visitsTotal}
              color={colors.accent.primary}
            />
          )}

          {/* PT Sessions */}
          <View style={[styles.limitRow, { marginTop: SPACING[4] }]}>
            <Text style={styles.limitLabel}>Персональные тренировки</Text>
            <Text style={styles.limitValue}>
              {membership.ptSessionsLeft} из {membership.ptSessionsTotal}
            </Text>
          </View>
          <ProgressBar
            current={membership.ptSessionsLeft}
            total={membership.ptSessionsTotal}
            color={colors.accent.primary}
          />
        </Card>

        {/* Access zones */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Зоны доступа</Text>
          <View style={styles.zonesWrap}>
            {membership.accessZones.map((zone) => (
              <Badge key={zone} text={zone} variant="accent" />
            ))}
          </View>
        </Card>

        {/* Freeze info */}
        {membership.freezeAvailable && membership.status === 'active' && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Заморозка</Text>
            <Text style={styles.freezeText}>
              {membership.freezeDaysLeft}{' '}
              {pluralize(membership.freezeDaysLeft, ['день', 'дня', 'дней'])}{' '}
              доступно
            </Text>
          </Card>
        )}

        {/* CTA buttons */}
        <View style={styles.actions}>
          {membership.status === 'active' && membership.freezeAvailable && (
            <Button title="Заморозить" variant="secondary" onPress={() => {}} />
          )}
          {membership.status === 'active' && (
            <Button title="Продлить" variant="primary" onPress={() => {}} />
          )}
          {membership.status === 'expired' && (
            <Button title="Купить тариф" variant="primary" onPress={() => router.push('/(client)/(more)/catalog')} />
          )}
          {membership.debtFlag && (
            <Button title="Погасить задолженность" variant="danger" onPress={() => router.push('/(client)/(more)/billing')} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  header: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
    paddingBottom: SPACING[4],
  },
  backButton: {
    ...t.typography.body,
    color: t.colors.text.accent,
    marginBottom: SPACING[2],
  },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
  },
  content: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[3],
  },
  planCard: {
    marginHorizontal: SPACING[4],
    marginBottom: SPACING[3],
    paddingVertical: SPACING[4],
    paddingHorizontal: SPACING[4],
  },
  planRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  planName: {
    ...t.typography.h3,
    color: t.colors.text.primary,
  },
  debtBanner: {
    marginTop: SPACING[3],
    backgroundColor: t.colors.semantic.error.surface,
    paddingVertical: SPACING[2],
    paddingHorizontal: SPACING[3],
    borderRadius: t.radius.sm,
  },
  debtText: {
    ...t.typography.bodySm,
    color: t.colors.semantic.error.main,
    fontWeight: '600' as const,
  },
  sectionCard: {
    marginHorizontal: SPACING[4],
    marginBottom: SPACING[3],
    paddingVertical: SPACING[4],
    paddingHorizontal: SPACING[4],
  },
  sectionTitle: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    fontWeight: '600' as const,
    marginBottom: SPACING[3],
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  daysRow: {
    flexDirection: 'row' as const,
    alignItems: 'baseline' as const,
    gap: SPACING[2],
    marginBottom: SPACING[2],
  },
  daysNumber: {
    ...t.typography.display,
    color: t.colors.text.primary,
  },
  daysLabel: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  limitRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: SPACING[2],
  },
  limitLabel: {
    ...t.typography.body,
    color: t.colors.text.primary,
  },
  limitValue: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    fontWeight: '600' as const,
  },
  zonesWrap: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: SPACING[2],
  },
  freezeText: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
  },
  actions: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
    paddingBottom: SPACING[8],
    gap: SPACING[3],
  },
}));
