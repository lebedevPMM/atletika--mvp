import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/shared/ui';
import { useAuthStore } from '@/features/auth/store';
import { useScreenView } from '@/features/analytics/tracker';
import { useTheme } from '@/shared/theme/useTheme';
import { createStyles } from '@/shared/theme/createStyles';
import { SPACING } from '@/shared/theme/types';

const OFFER_TEXT = `Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между ООО «Атлетика Плюс» (далее — «Компания») и пользователем мобильного приложения Atletika+ (далее — «Пользователь»).

1. Общие положения
1.1. Приложение предоставляет Пользователю доступ к услугам бронирования групповых и персональных тренировок, просмотра расписания, управления абонементом и иным функциям фитнес-клуба.
1.2. Использование Приложения означает полное и безоговорочное принятие Пользователем условий настоящего Соглашения.

2. Права и обязанности сторон
2.1. Компания обязуется обеспечивать работоспособность Приложения, защищать персональные данные Пользователя в соответствии с Федеральным законом №152-ФЗ «О персональных данных».
2.2. Пользователь обязуется предоставлять достоверные данные при регистрации, не передавать учетные данные третьим лицам, соблюдать правила посещения клуба.

3. Персональные данные
3.1. Компания осуществляет обработку персональных данных Пользователя в целях предоставления услуг, включая: имя, номер телефона, историю посещений, данные об абонементе.
3.2. Пользователь дает согласие на получение уведомлений о тренировках, акциях и изменениях в расписании.

4. Ответственность
4.1. Компания не несет ответственности за временную недоступность Приложения, вызванную техническими работами или обстоятельствами непреодолимой силы.
4.2. Все споры решаются путем переговоров, а при невозможности достижения согласия — в суде по месту нахождения Компании.

5. Заключительные положения
5.1. Компания вправе изменять условия Соглашения с уведомлением Пользователя через Приложение. Продолжение использования Приложения после изменений означает согласие с новой редакцией.`;

export default function OfferScreen() {
  useScreenView('client_offer');

  const router = useRouter();
  const { colors } = useTheme();
  const styles = useStyles();

  const [accepted, setAccepted] = useState(false);

  const handleToggle = useCallback(() => {
    setAccepted((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    useAuthStore.getState().setDocsUpdated(true);

    if (useAuthStore.getState().firstLogin) {
      router.replace('/(auth)/permissions');
    } else {
      router.replace('/(auth)/club-loading');
    }
  }, [router]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Пользовательское соглашение</Text>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
        >
          <Text style={styles.offerText}>{OFFER_TEXT}</Text>
        </ScrollView>

        <View style={styles.bottom}>
          <Pressable onPress={handleToggle} style={styles.checkboxRow}>
            <View
              style={[
                styles.checkbox,
                accepted && {
                  backgroundColor: colors.accent.primary,
                  borderColor: colors.accent.primary,
                },
              ]}
            >
              {accepted && <Text style={styles.checkmark}>{'\u2713'}</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              Принимаю условия оферты и политику конфиденциальности
            </Text>
          </Pressable>

          <Button
            title="Далее"
            onPress={handleNext}
            disabled={!accepted}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[4],
  },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
    marginBottom: SPACING[4],
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING[4],
  },
  offerText: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  bottom: {
    paddingVertical: SPACING[4],
    gap: SPACING[4],
  },
  checkboxRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[3],
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: t.radius.xs,
    borderWidth: 2,
    borderColor: t.colors.border.default,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  checkmark: {
    fontSize: 16,
    color: t.colors.text.inverse,
    fontWeight: '700' as const,
    lineHeight: 18,
  },
  checkboxLabel: {
    ...t.typography.bodySm,
    color: t.colors.text.primary,
    flex: 1,
  },
}));
