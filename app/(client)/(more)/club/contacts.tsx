import { useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, Skeleton, ErrorState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { useClubDetails } from '@/features/club/hooks';
import { SPACING } from '@/shared/theme/types';

const SOCIAL_LABELS: Record<string, string> = {
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  vk: 'ВКонтакте',
  instagram: 'Instagram',
};

export default function ClubContactsScreen() {
  useScreenView('client_club_contacts');
  const styles = useStyles();
  const router = useRouter();

  const { data: club, isLoading, isError, refetch } = useClubDetails();

  const handleCall = useCallback(() => {
    if (club?.phone) Linking.openURL(`tel:${club.phone}`);
  }, [club]);

  const handleEmail = useCallback(() => {
    if (club?.email) Linking.openURL(`mailto:${club.email}`);
  }, [club]);

  const handleMap = useCallback(() => {
    if (club?.coordinates) {
      const { lat, lng } = club.coordinates;
      Linking.openURL(`https://maps.google.com/?q=${lat},${lng}`);
    }
  }, [club]);

  const handleSocial = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Контакты</Text>
        </View>
        <View style={styles.content}><Skeleton variant="card" /><Skeleton variant="card" /></View>
      </SafeAreaView>
    );
  }

  if (isError || !club) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Контакты</Text>
        </View>
        <ErrorState message="Не удалось загрузить контакты" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Контакты</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Address */}
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Адрес</Text>
          <Text style={styles.cardValue}>{club.address}</Text>
          {club.coordinates && (
            <Pressable onPress={handleMap} style={styles.mapLink}>
              <Text style={styles.mapLinkText}>Показать на карте →</Text>
            </Pressable>
          )}
        </Card>

        {/* Hours */}
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Часы работы</Text>
          <Text style={styles.cardValue}>{club.hours}</Text>
        </Card>

        {/* Phone & Email */}
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Связаться</Text>
          <Pressable onPress={handleCall} style={styles.contactRow}>
            <Text style={styles.contactIcon}>📞</Text>
            <Text style={styles.contactLink}>{club.phone}</Text>
          </Pressable>
          <Pressable onPress={handleEmail} style={styles.contactRow}>
            <Text style={styles.contactIcon}>✉️</Text>
            <Text style={styles.contactLink}>{club.email}</Text>
          </Pressable>
        </Card>

        {/* Social links */}
        {club.socialLinks.length > 0 && (
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>Мессенджеры</Text>
            {club.socialLinks.map((link) => (
              <Pressable
                key={link.type}
                onPress={() => handleSocial(link.url)}
                style={styles.contactRow}
              >
                <Text style={styles.contactLink}>
                  {SOCIAL_LABELS[link.type] || link.type}
                </Text>
              </Pressable>
            ))}
          </Card>
        )}
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
  card: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
  cardLabel: {
    ...t.typography.bodySm,
    color: t.colors.text.tertiary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  cardValue: {
    ...t.typography.body,
    color: t.colors.text.primary,
  },
  mapLink: {
    marginTop: SPACING[1],
  },
  mapLinkText: {
    ...t.typography.bodySm,
    color: t.colors.accent.primary,
    fontWeight: '500' as const,
  },
  contactRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[3],
  },
  contactIcon: {
    fontSize: 18,
  },
  contactLink: {
    ...t.typography.body,
    color: t.colors.accent.primary,
    fontWeight: '500' as const,
  },
}));
