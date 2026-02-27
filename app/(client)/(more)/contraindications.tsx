import { useCallback } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Badge, Skeleton, ErrorState, EmptyState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useContraindications, useRemoveContraindication } from '@/features/health/hooks';
import { getSeverityLabel, getSeverityBadgeVariant } from '@/features/health/utils';
import { SPACING } from '@/shared/theme/types';
import type { Contraindication } from '@/features/health/types';

export default function ContraindicationsScreen() {
  useScreenView('client_contraindications');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();

  const { data: items, isLoading, isError, refetch, isRefetching } = useContraindications();
  const removeItem = useRemoveContraindication();

  const handleRemove = useCallback(
    (item: Contraindication) => {
      haptic.selection();
      Alert.alert('Удалить противопоказание?', item.title, [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => removeItem.mutate(item.id) },
      ]);
    },
    [haptic, removeItem],
  );

  const renderItem = useCallback(
    ({ item }: { item: Contraindication }) => (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onLongPress={() => handleRemove(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Badge text={getSeverityLabel(item.severity)} variant={getSeverityBadgeVariant(item.severity)} />
        </View>
        <Text style={styles.cardDesc}>{item.description}</Text>
      </Pressable>
    ),
    [styles, handleRemove],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Противопоказания</Text>
        </View>
        <View style={styles.skeletonList}><Skeleton variant="card" /><Skeleton variant="card" /></View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Противопоказания</Text>
        </View>
        <ErrorState message="Не удалось загрузить данные" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Противопоказания</Text>
      </View>

      <Text style={styles.hint}>Эти данные видны вашему тренеру для безопасных тренировок</Text>

      <FlatList
        data={items ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, (items ?? []).length === 0 && styles.emptyContainer]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent.primary} />
        }
        ListEmptyComponent={
          <EmptyState icon="🩺" title="Нет противопоказаний" subtitle="Информация о медицинских ограничениях появится здесь" />
        }
      />
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: { flex: 1, backgroundColor: t.colors.bg.primary },
  header: {
    flexDirection: 'row' as const, alignItems: 'center' as const,
    paddingHorizontal: SPACING[4], paddingTop: SPACING[2], paddingBottom: SPACING[3], gap: SPACING[3],
  },
  headerTitle: { ...t.typography.h3, color: t.colors.text.primary },
  backBtn: {
    width: 40, height: 40, borderRadius: t.radius.full,
    backgroundColor: t.colors.bg.elevated, alignItems: 'center' as const, justifyContent: 'center' as const,
  },
  backText: { fontSize: 20, color: t.colors.text.primary },
  hint: {
    ...t.typography.bodySm, color: t.colors.text.tertiary,
    paddingHorizontal: SPACING[4], marginBottom: SPACING[3],
  },
  skeletonList: { padding: SPACING[4], gap: SPACING[3] },
  listContent: { paddingHorizontal: SPACING[4], paddingBottom: SPACING[6], gap: SPACING[3] },
  emptyContainer: { flex: 1 },
  card: {
    backgroundColor: t.colors.bg.elevated, borderRadius: t.radius.lg,
    padding: SPACING[4], gap: SPACING[2],
  },
  cardPressed: { opacity: 0.85 },
  cardHeader: {
    flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const,
  },
  cardTitle: { ...t.typography.body, color: t.colors.text.primary, fontWeight: '600' as const, flex: 1, marginRight: SPACING[2] },
  cardDesc: { ...t.typography.bodySm, color: t.colors.text.secondary },
}));
