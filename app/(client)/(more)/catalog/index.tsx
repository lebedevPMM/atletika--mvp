import { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCategories, useItems } from '@/features/catalog/hooks';
import type { CatalogItem } from '@/features/catalog/types';
import { formatAmount } from '@/features/billing/utils';
import { Card, Badge, FilterChips, Input, EmptyState, ErrorState, Skeleton } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING } from '@/shared/theme/types';

function ItemCard({ item }: { item: CatalogItem }) {
  const styles = useStyles();
  const { colors } = useTheme();

  const cardStyle = item.available
    ? styles.card
    : { ...styles.card, ...styles.cardUnavailable };

  return (
    <Card style={cardStyle}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.tagsRow}>
          {item.tags.map((tag) => (
            <Badge key={tag} text={tag} variant="accent" />
          ))}
        </View>
      </View>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.price}>
          {item.price === 0 ? 'Бесплатно' : formatAmount(item.price, item.currency)}
        </Text>
        {!item.available && (
          <Text style={[styles.unavailableLabel, { color: colors.semantic.error.main }]}>
            Недоступно
          </Text>
        )}
      </View>
    </Card>
  );
}

function LoadingSkeleton() {
  const styles = useStyles();
  return (
    <View style={styles.list}>
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} variant="list" style={{ height: 100 }} />
      ))}
    </View>
  );
}

export default function CatalogScreen() {
  useScreenView('client_catalog');
  const styles = useStyles();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categories } = useCategories();
  const {
    data: items,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useItems(selectedCategory || undefined);

  const chips = useMemo(() => {
    if (!categories) return [];
    return categories.map((c) => ({ label: `${c.icon} ${c.name}`, value: c.id }));
  }, [categories]);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q),
    );
  }, [items, searchQuery]);

  const renderItem = useCallback(
    ({ item }: { item: CatalogItem }) => <ItemCard item={item} />,
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backButton}>{'<'} Назад</Text>
        </Pressable>
        <Text style={styles.title}>Каталог</Text>
      </View>

      <View style={styles.searchWrapper}>
        <Input
          placeholder="Поиск по названию..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {chips.length > 0 && (
        <View style={styles.chipsWrapper}>
          <FilterChips
            chips={chips}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </View>
      )}

      {isError ? (
        <ErrorState message="Не удалось загрузить каталог" onRetry={refetch} />
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="📦"
              title="Ничего не найдено"
              subtitle={
                searchQuery
                  ? 'Попробуйте изменить запрос'
                  : 'В этой категории пока нет услуг'
              }
            />
          }
        />
      )}
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
  searchWrapper: {
    paddingHorizontal: SPACING[4],
    marginBottom: SPACING[3],
  },
  chipsWrapper: {
    marginBottom: SPACING[3],
  },
  list: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[3],
    paddingBottom: SPACING[8],
  },
  card: {
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
  },
  cardUnavailable: {
    opacity: 0.5,
  },
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: SPACING[1],
  },
  cardTitle: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
    flex: 1,
    marginRight: SPACING[2],
  },
  tagsRow: {
    flexDirection: 'row' as const,
    gap: SPACING[1],
  },
  cardDescription: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    marginBottom: SPACING[2],
  },
  cardFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  price: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
  unavailableLabel: {
    ...t.typography.bodySm,
    fontWeight: '600' as const,
  },
}));
