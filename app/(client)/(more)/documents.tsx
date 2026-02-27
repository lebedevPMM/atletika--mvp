import { useCallback } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Skeleton, ErrorState, EmptyState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useDocuments } from '@/features/health/hooks';
import { getDocTypeLabel, getDocTypeIcon } from '@/features/health/utils';
import { formatNewsDate } from '@/features/club/utils';
import { SPACING } from '@/shared/theme/types';
import type { DocumentItem } from '@/features/health/types';

export default function DocumentsScreen() {
  useScreenView('client_documents');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();

  const { data: docs, isLoading, isError, refetch, isRefetching } = useDocuments();

  const handleOpenDoc = useCallback(
    (item: DocumentItem) => {
      haptic.selection();
      Linking.openURL(item.url);
    },
    [haptic],
  );

  const renderDoc = useCallback(
    ({ item }: { item: DocumentItem }) => (
      <Pressable
        onPress={() => handleOpenDoc(item)}
        style={({ pressed }) => [styles.docCard, pressed && styles.docCardPressed]}
      >
        <Text style={styles.docIcon}>{getDocTypeIcon(item.type)}</Text>
        <View style={styles.docContent}>
          <Text style={styles.docTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.docMeta}>
            <Text style={styles.docType}>{getDocTypeLabel(item.type)}</Text>
            <Text style={styles.docDate}>{formatNewsDate(item.createdAt)}</Text>
          </View>
        </View>
        <Text style={styles.docChevron}>{'›'}</Text>
      </Pressable>
    ),
    [styles, handleOpenDoc],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Документы</Text>
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
          <Text style={styles.headerTitle}>Документы</Text>
        </View>
        <ErrorState message="Не удалось загрузить документы" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Документы</Text>
      </View>

      <FlatList
        data={docs ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderDoc}
        contentContainerStyle={[styles.listContent, (docs ?? []).length === 0 && styles.emptyContainer]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent.primary} />
        }
        ListEmptyComponent={
          <EmptyState icon="📁" title="Нет документов" subtitle="Справки, договоры и квитанции появятся здесь" />
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
  skeletonList: { padding: SPACING[4], gap: SPACING[3] },
  listContent: { paddingHorizontal: SPACING[4], paddingBottom: SPACING[6], gap: SPACING[2] },
  emptyContainer: { flex: 1 },
  docCard: {
    flexDirection: 'row' as const, backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg, padding: SPACING[4], gap: SPACING[3], alignItems: 'center' as const,
  },
  docCardPressed: { opacity: 0.85 },
  docIcon: { fontSize: 28 },
  docContent: { flex: 1, gap: SPACING[1] },
  docTitle: { ...t.typography.body, color: t.colors.text.primary },
  docMeta: { flexDirection: 'row' as const, gap: SPACING[2] },
  docType: { ...t.typography.caption, color: t.colors.text.tertiary },
  docDate: { ...t.typography.caption, color: t.colors.text.tertiary },
  docChevron: { fontSize: 20, color: t.colors.text.tertiary },
}));
