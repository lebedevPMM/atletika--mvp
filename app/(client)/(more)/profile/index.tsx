import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useProfile, useUpdateProfile } from '@/features/profile/hooks';
import { Card, Button, Input, Skeleton, ErrorState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { SPACING } from '@/shared/theme/types';

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Не указана';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatMemberSince(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
}

function LoadingSkeleton() {
  const styles = useStyles();
  return (
    <View style={styles.content}>
      <View style={styles.avatarContainer}>
        <Skeleton variant="list" style={{ width: 96, height: 96, borderRadius: 48 }} />
      </View>
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} variant="list" style={{ height: 64 }} />
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  useScreenView('client_profile');
  const styles = useStyles();
  const router = useRouter();
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const updateProfile = useUpdateProfile();
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');

  const handleEditEmail = () => {
    setEmailDraft(profile?.email ?? '');
    setEditingEmail(true);
  };

  const handleSaveEmail = () => {
    updateProfile.mutate(
      { email: emailDraft || null },
      { onSuccess: () => setEditingEmail(false) },
    );
  };

  const handleCancelEmail = () => {
    setEditingEmail(false);
    setEmailDraft('');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backButton}>{'<'} Назад</Text>
          </Pressable>
          <Text style={styles.title}>Профиль</Text>
        </View>
        <LoadingSkeleton />
      </SafeAreaView>
    );
  }

  if (isError || !profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backButton}>{'<'} Назад</Text>
          </Pressable>
          <Text style={styles.title}>Профиль</Text>
        </View>
        <ErrorState message="Не удалось загрузить профиль" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backButton}>{'<'} Назад</Text>
          </Pressable>
          <Text style={styles.title}>Профиль</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(profile.firstName, profile.lastName)}
            </Text>
          </View>
        </View>

        {/* Name */}
        <Text style={styles.name}>
          {profile.firstName} {profile.lastName}
        </Text>

        {/* Info cards */}
        <View style={styles.content}>
          {/* Phone */}
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Телефон</Text>
            <Text style={styles.infoValue}>{profile.phone}</Text>
          </Card>

          {/* Email */}
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Email</Text>
            {editingEmail ? (
              <View style={styles.editRow}>
                <View style={styles.editInput}>
                  <Input
                    value={emailDraft}
                    onChangeText={setEmailDraft}
                    placeholder="email@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoFocus
                  />
                </View>
                <View style={styles.editActions}>
                  <Button
                    title="Сохранить"
                    variant="primary"
                    size="small"
                    onPress={handleSaveEmail}
                    loading={updateProfile.isPending}
                  />
                  <Button
                    title="Отмена"
                    variant="ghost"
                    size="small"
                    onPress={handleCancelEmail}
                  />
                </View>
              </View>
            ) : (
              <Pressable onPress={handleEditEmail}>
                <View style={styles.editableRow}>
                  <Text style={styles.infoValue}>
                    {profile.email ?? 'Не указан'}
                  </Text>
                  <Text style={styles.editHint}>Изменить</Text>
                </View>
              </Pressable>
            )}
          </Card>

          {/* Birth date */}
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Дата рождения</Text>
            <Text style={styles.infoValue}>{formatDate(profile.birthDate)}</Text>
          </Card>

          {/* Member since */}
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Клиент с</Text>
            <Text style={styles.infoValue}>{formatMemberSince(profile.memberSince)}</Text>
          </Card>
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
  avatarContainer: {
    alignItems: 'center' as const,
    marginBottom: SPACING[3],
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: t.colors.accent.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: t.colors.text.inverse,
  },
  name: {
    ...t.typography.h2,
    color: t.colors.text.primary,
    textAlign: 'center' as const,
    marginBottom: SPACING[6],
  },
  content: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[3],
    paddingBottom: SPACING[8],
  },
  infoCard: {
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
  },
  infoLabel: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    marginBottom: SPACING[1],
  },
  infoValue: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
  },
  editableRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  editHint: {
    ...t.typography.bodySm,
    color: t.colors.text.accent,
  },
  editRow: {
    gap: SPACING[3],
  },
  editInput: {
    flex: 1,
  },
  editActions: {
    flexDirection: 'row' as const,
    gap: SPACING[2],
  },
}));
