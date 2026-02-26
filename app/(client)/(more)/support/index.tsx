import { useState } from 'react';
import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Card, Button, Input } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { SPACING } from '@/shared/theme/types';

const PHONE = '+7 (800) 123-45-67';
const EMAIL = 'support@atletika.ru';
const HOURS = 'Пн-Пт: 9:00-21:00, Сб-Вс: 10:00-18:00';

export default function SupportScreen() {
  useScreenView('client_support');
  const styles = useStyles();
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const isFormEmpty = !subject.trim() && !description.trim();

  const handleCopy = async (value: string, label: string) => {
    await Clipboard.setStringAsync(value);
    Alert.alert(`${label} скопирован`);
  };

  const handleSubmit = () => {
    Alert.alert(
      'Обращение отправлено',
      'Мы ответим в течение 24 часов.',
    );
    setSubject('');
    setDescription('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backButton}>{'<'} Назад</Text>
          </Pressable>
          <Text style={styles.title}>Поддержка</Text>
        </View>

        <View style={styles.content}>
          {/* Contact cards */}
          <Pressable onPress={() => handleCopy(PHONE, 'Номер')}>
            <Card style={styles.contactCard}>
              <View style={styles.contactRow}>
                <Text style={styles.contactIcon}>{'\uD83D\uDCDE'}</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Телефон</Text>
                  <Text style={styles.contactValue}>{PHONE}</Text>
                </View>
              </View>
            </Card>
          </Pressable>

          <Pressable onPress={() => handleCopy(EMAIL, 'Email')}>
            <Card style={styles.contactCard}>
              <View style={styles.contactRow}>
                <Text style={styles.contactIcon}>{'\u2709\uFE0F'}</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>{EMAIL}</Text>
                </View>
              </View>
            </Card>
          </Pressable>

          <Card style={styles.contactCard}>
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>{'\uD83D\uDD50'}</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Часы работы</Text>
                <Text style={styles.contactValue}>{HOURS}</Text>
              </View>
            </View>
          </Card>

          {/* Ticket form */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Написать обращение</Text>

            <Input
              label="Тема"
              value={subject}
              onChangeText={setSubject}
              placeholder="Тема обращения"
            />

            <Input
              label="Описание"
              value={description}
              onChangeText={setDescription}
              placeholder="Опишите вашу проблему"
              multiline
              numberOfLines={4}
              style={styles.multilineInput}
            />

            <Button
              title="Отправить"
              variant="primary"
              onPress={handleSubmit}
              disabled={isFormEmpty}
            />
          </View>
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
    gap: SPACING[3],
    paddingBottom: SPACING[8],
  },
  contactCard: {
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
  },
  contactRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: SPACING[3],
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    marginBottom: SPACING[1],
  },
  contactValue: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
  },
  formSection: {
    marginTop: SPACING[4],
    gap: SPACING[4],
  },
  formTitle: {
    ...t.typography.h3,
    color: t.colors.text.primary,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top' as const,
    paddingTop: 12,
  },
}));
