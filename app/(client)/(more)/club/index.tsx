import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, Badge } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { useClubStore } from '@/features/club/store';
import { SPACING } from '@/shared/theme/types';

const CLUB_ADDRESS = 'ул. Спортивная, 15, Москва';
const CLUB_PHONE = '+7 (495) 123-45-67';
const CLUB_HOURS = 'Пн-Пт: 6:00-23:00, Сб-Вс: 8:00-22:00';

const FEATURES = [
  'Тренажёрный зал',
  'Бассейн',
  'СПА',
  'Групповые',
  'Сауна',
  'Парковка',
];

export default function ClubInfoScreen() {
  useScreenView('client_club_info');
  const styles = useStyles();
  const router = useRouter();
  const clubName = useClubStore((s) => s.clubName) ?? 'Atletika Премиум';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backButton}>{'<'} Назад</Text>
          </Pressable>
          <Text style={styles.title}>О клубе</Text>
        </View>

        <View style={styles.content}>
          {/* Club info card */}
          <Card style={styles.infoCard}>
            <Text style={styles.clubName}>{clubName}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Адрес</Text>
              <Text style={styles.infoValue}>{CLUB_ADDRESS}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Телефон</Text>
              <Text style={styles.infoValue}>{CLUB_PHONE}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Часы работы</Text>
              <Text style={styles.infoValue}>{CLUB_HOURS}</Text>
            </View>
          </Card>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Услуги</Text>
            <View style={styles.featuresGrid}>
              {FEATURES.map((feature) => (
                <Badge key={feature} text={feature} variant="accent" />
              ))}
            </View>
          </View>

          {/* Description */}
          <Card style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>
              Atletika — сеть фитнес-клубов премиум-класса. Более 50 000 м{'\u00B2'} спортивных площадей.
            </Text>
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
  content: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[4],
    paddingBottom: SPACING[8],
  },
  infoCard: {
    paddingVertical: SPACING[4],
    paddingHorizontal: SPACING[4],
    gap: SPACING[3],
  },
  clubName: {
    ...t.typography.h2,
    color: t.colors.text.primary,
    marginBottom: SPACING[2],
  },
  infoRow: {
    gap: SPACING[1],
  },
  infoLabel: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  infoValue: {
    ...t.typography.body,
    color: t.colors.text.primary,
  },
  featuresSection: {
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
  descriptionCard: {
    paddingVertical: SPACING[4],
    paddingHorizontal: SPACING[4],
  },
  descriptionText: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    lineHeight: 22,
  },
}));
