import { useCallback } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Card, Badge, Skeleton, ErrorState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { useTeamMember } from '@/features/club/hooks';
import { getRoleLabel, getRoleBadgeVariant, formatRating } from '@/features/club/utils';
import { getInitials } from '@/features/club/utils';
import { SPACING } from '@/shared/theme/types';

export default function TrainerProfileScreen() {
  useScreenView('client_trainer_profile');
  const { trainerId } = useLocalSearchParams<{ trainerId: string }>();
  const styles = useStyles();
  const router = useRouter();

  const { data: trainer, isLoading, isError, refetch } = useTeamMember(trainerId ?? '');

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleChat = useCallback(() => {
    if (trainerId) {
      router.push(`/(client)/(more)/chat/${trainerId}`);
    }
  }, [router, trainerId]);

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

  if (isError || !trainer) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
        </View>
        <ErrorState message="Не удалось загрузить профиль" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Профиль</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Avatar + Name */}
        <View style={styles.profileTop}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{getInitials(trainer.name)}</Text>
          </View>
          <Text style={styles.trainerName}>{trainer.name}</Text>
          <View style={styles.badges}>
            <Badge text={getRoleLabel(trainer.role)} variant={getRoleBadgeVariant(trainer.role)} />
            <Text style={styles.rating}>{'★ '}{formatRating(trainer.rating)}</Text>
          </View>
        </View>

        {/* Info */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Специализация</Text>
            <Text style={styles.infoValue}>{trainer.specialization}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Опыт</Text>
            <Text style={styles.infoValue}>{trainer.experience}</Text>
          </View>
        </Card>

        {/* Bio */}
        {trainer.bio && (
          <Card style={styles.infoCard}>
            <Text style={styles.sectionLabel}>О себе</Text>
            <Text style={styles.bioText}>{trainer.bio}</Text>
          </Card>
        )}

        {/* Certifications */}
        {trainer.certifications && trainer.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Сертификаты</Text>
            <View style={styles.certsGrid}>
              {trainer.certifications.map((cert) => (
                <Badge key={cert} text={cert} variant="info" />
              ))}
            </View>
          </View>
        )}

        {/* Chat button */}
        <Pressable onPress={handleChat} style={styles.chatButton}>
          <Text style={styles.chatButtonText}>Написать сообщение</Text>
        </Pressable>
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
    ...t.typography.h3,
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
  profileTop: {
    alignItems: 'center' as const,
    gap: SPACING[3],
    paddingVertical: SPACING[4],
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.accent.surface,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  avatarLargeText: {
    ...t.typography.h2,
    color: t.colors.accent.primary,
  },
  trainerName: {
    ...t.typography.h2,
    color: t.colors.text.primary,
  },
  badges: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[3],
  },
  rating: {
    ...t.typography.body,
    color: t.colors.semantic.warning.main,
    fontWeight: '600' as const,
  },
  infoCard: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  infoLabel: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  infoValue: {
    ...t.typography.body,
    color: t.colors.text.primary,
    fontWeight: '500' as const,
  },
  section: {
    gap: SPACING[3],
  },
  sectionLabel: {
    ...t.typography.bodySm,
    color: t.colors.text.tertiary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  bioText: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    lineHeight: 22,
  },
  certsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: SPACING[2],
  },
  chatButton: {
    backgroundColor: t.colors.accent.primary,
    borderRadius: t.radius.lg,
    paddingVertical: SPACING[4],
    alignItems: 'center' as const,
  },
  chatButtonText: {
    ...t.typography.body,
    color: t.colors.text.inverse,
    fontWeight: '600' as const,
  },
}));
