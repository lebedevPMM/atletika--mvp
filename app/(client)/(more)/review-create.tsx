import { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Input, SegmentedControl } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useCreateReview } from '@/features/reviews/hooks';
import { getRatingLabel } from '@/features/reviews/utils';
import { SPACING } from '@/shared/theme/types';

const REVIEW_TYPES = ['Тренер', 'Занятие', 'Клуб'];
const REVIEW_TYPE_KEYS = ['trainer', 'class', 'club'] as const;

export default function ReviewCreateScreen() {
  useScreenView('client_review_create');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();

  const createReview = useCreateReview();

  const [typeIndex, setTypeIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  const isValid = rating > 0 && text.length >= 10;

  const handleStarPress = useCallback(
    (star: number) => {
      haptic.selection();
      setRating(star);
    },
    [haptic],
  );

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    haptic.medium();

    createReview.mutate(
      {
        type: REVIEW_TYPE_KEYS[typeIndex],
        rating,
        text: text.trim(),
      },
      {
        onSuccess: () => {
          Alert.alert('Спасибо за отзыв!', 'Ваш отзыв успешно отправлен', [
            { text: 'ОК', onPress: () => router.back() },
          ]);
        },
        onError: () => {
          Alert.alert('Ошибка', 'Не удалось отправить отзыв. Попробуйте ещё раз.');
        },
      },
    );
  }, [isValid, haptic, createReview, typeIndex, rating, text, router]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Новый отзыв</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Review type */}
        <Text style={styles.sectionLabel}>Тип отзыва</Text>
        <SegmentedControl
          segments={REVIEW_TYPES}
          selectedIndex={typeIndex}
          onSelect={setTypeIndex}
        />

        {/* Star rating */}
        <Text style={styles.sectionLabel}>Оценка</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => handleStarPress(star)} style={styles.starBtn}>
              <Text style={[styles.starText, star <= rating && styles.starActive]}>
                {star <= rating ? '★' : '☆'}
              </Text>
            </Pressable>
          ))}
        </View>
        {rating > 0 && (
          <Text style={styles.ratingLabel}>{getRatingLabel(rating)}</Text>
        )}

        {/* Review text */}
        <Text style={styles.sectionLabel}>Отзыв</Text>
        <Input
          value={text}
          onChangeText={setText}
          placeholder="Поделитесь впечатлениями..."
          multiline
          numberOfLines={5}
          style={styles.textInput}
          textAlignVertical="top"
        />
        {text.length > 0 && text.length < 10 && (
          <Text style={styles.charHint}>Минимум 10 символов ({text.length}/10)</Text>
        )}

        {/* Submit */}
        <Button
          title="Отправить отзыв"
          variant="primary"
          onPress={handleSubmit}
          disabled={!isValid}
          loading={createReview.isPending}
          style={styles.submitBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: { flex: 1, backgroundColor: t.colors.bg.primary },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
    paddingBottom: SPACING[3],
    gap: SPACING[3],
  },
  headerTitle: { ...t.typography.h3, color: t.colors.text.primary },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.bg.elevated,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  backText: { fontSize: 20, color: t.colors.text.primary },
  content: { padding: SPACING[4], gap: SPACING[3], paddingBottom: SPACING[6] },
  sectionLabel: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    fontWeight: '600' as const,
    marginTop: SPACING[2],
  },
  starsContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: SPACING[3],
    paddingVertical: SPACING[2],
  },
  starBtn: {
    width: 48,
    height: 48,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  starText: {
    fontSize: 36,
    color: t.colors.text.tertiary,
  },
  starActive: {
    color: '#F5A623',
  },
  ratingLabel: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    textAlign: 'center' as const,
  },
  textInput: {
    height: 120,
    paddingTop: SPACING[3],
  },
  charHint: {
    ...t.typography.caption,
    color: t.colors.semantic.error.main,
  },
  submitBtn: { marginTop: SPACING[4] },
}));
