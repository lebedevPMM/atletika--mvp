import { useCallback } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Badge, Skeleton, ErrorState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { useNewsItem } from '@/features/club/hooks';
import { getNewsCategoryLabel, getNewsCategoryBadgeVariant, formatNewsDate } from '@/features/club/utils';
import { SPACING } from '@/shared/theme/types';

export default function NewsDetailScreen() {
  useScreenView('client_club_news_detail');
  const { newsId } = useLocalSearchParams<{ newsId: string }>();
  const styles = useStyles();
  const router = useRouter();

  const { data: news, isLoading, isError, refetch } = useNewsItem(newsId ?? '');

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
        </View>
        <View style={styles.content}><Skeleton variant="card" /><Skeleton variant="card" /></View>
      </SafeAreaView>
    );
  }

  if (isError || !news) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
        </View>
        <ErrorState message="Не удалось загрузить новость" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Новость</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.metaRow}>
          <Badge
            text={getNewsCategoryLabel(news.category)}
            variant={getNewsCategoryBadgeVariant(news.category)}
          />
          <Text style={styles.dateText}>{formatNewsDate(news.publishedAt)}</Text>
        </View>

        <Text style={styles.title}>{news.title}</Text>
        <Text style={styles.body}>{news.body}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
    paddingBottom: SPACING[3],
    gap: SPACING[3],
  },
  headerTitle: {
    ...t.typography.body,
    color: t.colors.text.primary,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.bg.elevated,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  backText: {
    fontSize: 20,
    color: t.colors.text.primary,
  },
  content: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[4],
    paddingBottom: SPACING[8],
  },
  metaRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[3],
  },
  dateText: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
  },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
  },
  body: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    lineHeight: 24,
  },
}));
