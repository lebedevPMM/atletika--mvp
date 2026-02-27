import { useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, Badge, Skeleton, ErrorState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { useClubDetails } from '@/features/club/hooks';
import { SPACING } from '@/shared/theme/types';

export default function ClubInfoScreen() {
  useScreenView('client_club_info');
  const styles = useStyles();
  const router = useRouter();

  const { data: club, isLoading, isError, refetch } = useClubDetails();

  const handleCall = useCallback(() => {
    if (club?.phone) Linking.openURL(`tel:${club.phone}`);
  }, [club]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>О клубе</Text>
        </View>
        <View style={styles.content}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !club) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>О клубе</Text>
        </View>
        <ErrorState message="Не удалось загрузить информацию" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>О клубе</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Club name & description */}
        <Card style={styles.infoCard}>
          <Text style={styles.clubName}>{club.name}</Text>
          <Text style={styles.description}>{club.description}</Text>
        </Card>

        {/* Contact info */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Адрес</Text>
            <Text style={styles.infoValue}>{club.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Телефон</Text>
            <Pressable onPress={handleCall}>
              <Text style={styles.infoLink}>{club.phone}</Text>
            </Pressable>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{club.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Часы работы</Text>
            <Text style={styles.infoValue}>{club.hours}</Text>
          </View>
        </Card>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Услуги</Text>
          <View style={styles.featuresGrid}>
            {club.features.map((f) => (
              <Badge key={f} text={f} variant="accent" />
            ))}
          </View>
        </View>

        {/* Navigation links */}
        <View style={styles.linksSection}>
          <Pressable
            style={styles.linkRow}
            onPress={() => router.push('/(client)/(more)/club/contacts')}
          >
            <Text style={styles.linkText}>Контакты и как добраться</Text>
            <Text style={styles.linkArrow}>{'→'}</Text>
          </Pressable>
          <Pressable
            style={styles.linkRow}
            onPress={() => router.push('/(client)/(more)/club/team')}
          >
            <Text style={styles.linkText}>Наша команда</Text>
            <Text style={styles.linkArrow}>{'→'}</Text>
          </Pressable>
          <Pressable
            style={styles.linkRow}
            onPress={() => router.push('/(client)/(more)/club/news')}
          >
            <Text style={styles.linkText}>Новости и акции</Text>
            <Text style={styles.linkArrow}>{'→'}</Text>
          </Pressable>
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
  infoCard: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
  clubName: {
    ...t.typography.h2,
    color: t.colors.text.primary,
  },
  description: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    lineHeight: 22,
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
    flexShrink: 1,
    textAlign: 'right' as const,
  },
  infoLink: {
    ...t.typography.body,
    color: t.colors.accent.primary,
    fontWeight: '500' as const,
  },
  section: {
    gap: SPACING[3],
  },
  sectionTitle: {
    ...t.typography.h3,
    color: t.colors.text.primary,
  },
  featuresGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: SPACING[2],
  },
  linksSection: {
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    overflow: 'hidden' as const,
  },
  linkRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[4],
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border.default,
  },
  linkText: {
    ...t.typography.body,
    color: t.colors.text.primary,
  },
  linkArrow: {
    ...t.typography.body,
    color: t.colors.text.tertiary,
  },
}));
