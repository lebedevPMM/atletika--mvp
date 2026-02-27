import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING } from '@/shared/theme/types';
import { useScreenView } from '@/features/analytics/tracker';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useTrainerProfile, useUpdateTrainerProfile } from '@/features/trainer/hooks';
import { Button, Input, Skeleton, ErrorState, Card } from '@/shared/ui';

const ALL_SPECIALIZATIONS = [
  'Силовые', 'HIIT', 'Functional', 'Yoga', 'Pilates',
  'Cardio', 'CrossFit', 'Бокс', 'Растяжка', 'TRX',
];

export default function TrainerProfileEditScreen() {
  useScreenView('trainer_profile_edit');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();

  const { data: profile, isLoading, isError, refetch } = useTrainerProfile();
  const updateProfile = useUpdateTrainerProfile();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setEmail(profile.email);
      setBio(profile.bio);
      setSpecializations(profile.specializations);
    }
  }, [profile]);

  const toggleSpecialization = (spec: string) => {
    haptic.selection();
    setSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec],
    );
  };

  const handleSave = () => {
    haptic.medium();
    updateProfile.mutate(
      { firstName, lastName, email, bio, specializations },
      {
        onSuccess: () => {
          Alert.alert('Готово', 'Профиль обновлён');
          router.back();
        },
        onError: () => {
          Alert.alert('Ошибка', 'Не удалось сохранить профиль');
        },
      },
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Редактирование профиля</Text>
        </View>
        <View style={styles.skeletonList}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="list" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !profile) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Редактирование профиля</Text>
        </View>
        <ErrorState message="Не удалось загрузить профиль" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Редактирование профиля</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Имя"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Введите имя"
        />

        <Input
          label="Фамилия"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Введите фамилию"
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="О себе"
          value={bio}
          onChangeText={setBio}
          placeholder="Расскажите о себе"
          multiline
          numberOfLines={4}
          style={styles.bioInput}
        />

        {/* Specializations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Специализации</Text>
          <View style={styles.chipContainer}>
            {ALL_SPECIALIZATIONS.map((spec) => {
              const isSelected = specializations.includes(spec);
              return (
                <Pressable
                  key={spec}
                  onPress={() => toggleSpecialization(spec)}
                  style={[
                    styles.chip,
                    isSelected && { backgroundColor: colors.accent.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && { color: colors.text.inverse },
                    ]}
                  >
                    {spec}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Certifications */}
        <Card style={styles.certCard}>
          <Text style={styles.sectionTitle}>Сертификаты</Text>
          {profile.certifications.map((cert) => (
            <View key={cert} style={styles.certRow}>
              <Text style={styles.certBadge}>{'\u2705'}</Text>
              <Text style={styles.certText}>{cert}</Text>
            </View>
          ))}
        </Card>

        <Button
          title="Сохранить"
          variant="primary"
          onPress={handleSave}
          loading={updateProfile.isPending}
        />
      </ScrollView>
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
  scroll: { flex: 1 },
  content: { padding: SPACING[4], gap: SPACING[4], paddingBottom: SPACING[10] },
  bioInput: { height: 100, textAlignVertical: 'top' as const, paddingTop: 12 },
  section: { gap: SPACING[2] },
  sectionTitle: { ...t.typography.h4, color: t.colors.text.primary },
  chipContainer: {
    flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: SPACING[2],
  },
  chip: {
    paddingHorizontal: SPACING[3], paddingVertical: SPACING[2],
    borderRadius: t.radius.full, backgroundColor: t.colors.bg.elevated,
    borderWidth: 1, borderColor: t.colors.border.default,
  },
  chipText: { ...t.typography.bodySm, color: t.colors.text.primary },
  certCard: { gap: SPACING[3] },
  certRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: SPACING[2] },
  certBadge: { fontSize: 16 },
  certText: { ...t.typography.body, color: t.colors.text.primary },
}));
