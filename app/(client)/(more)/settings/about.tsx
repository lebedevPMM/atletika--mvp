import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { SPACING } from '@/shared/theme/types';

export default function AboutScreen() {
  useScreenView('client_about');
  const styles = useStyles();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backButton}>{'<'} Назад</Text>
        </Pressable>
        <Text style={styles.title}>О приложении</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.infoCard}>
          <Text style={styles.appName}>Атлетика+</Text>
          <Text style={styles.version}>Версия 1.0.0</Text>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.label}>Разработчик</Text>
          <Text style={styles.value}>Atletika+ Team</Text>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.label}>Контакты поддержки</Text>
          <Text style={styles.value}>support@atletika.app</Text>
        </Card>
      </View>
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
    gap: SPACING[3],
  },
  infoCard: {
    paddingVertical: SPACING[4],
    paddingHorizontal: SPACING[4],
    alignItems: 'center' as const,
  },
  appName: {
    ...t.typography.h2,
    color: t.colors.text.primary,
    marginBottom: SPACING[1],
  },
  version: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  label: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    marginBottom: SPACING[1],
  },
  value: {
    ...t.typography.body,
    color: t.colors.text.primary,
  },
}));
