import { useState } from 'react';
import { View, Text, ScrollView, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING, LAYOUT } from '@/shared/theme/types';
import { useScreenView } from '@/features/analytics/tracker';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useTrainerSession, useMarkAttendance, useCancelSession } from '@/features/trainer/hooks';
import { Card, Badge, Button, Skeleton } from '@/shared/ui';
import { getInitials } from '@/features/profile/utils';

function getSessionTypeLabel(type: string): string {
  switch (type) {
    case 'pt': return 'ПТ';
    case 'group': return 'Групповое';
    case 'spa': return 'СПА';
    default: return type;
  }
}

function getSessionBadgeVariant(type: string): 'accent' | 'info' | 'warning' {
  switch (type) {
    case 'pt': return 'accent';
    case 'group': return 'info';
    case 'spa': return 'warning';
    default: return 'accent';
  }
}

export default function TrainerSessionDetailScreen() {
  useScreenView('trainer_session_detail');

  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const styles = useStyles();
  const { colors } = useTheme();
  const haptic = useHaptic();

  const { data: session, isLoading } = useTrainerSession(sessionId ?? '');
  const markAttendance = useMarkAttendance();
  const cancelSession = useCancelSession();

  const [notes, setNotes] = useState('');

  const handleMarkAttendance = () => {
    if (!sessionId) return;
    haptic.success();
    markAttendance.mutate(sessionId, {
      onSuccess: () => {
        Alert.alert('Готово', 'Занятие отмечено как завершённое');
      },
    });
  };

  const handleCancel = () => {
    if (!sessionId) return;
    Alert.alert(
      'Отменить занятие?',
      'Это действие нельзя отменить. Клиент будет уведомлён об отмене.',
      [
        { text: 'Нет', style: 'cancel' },
        {
          text: 'Да, отменить',
          style: 'destructive',
          onPress: () => {
            haptic.error();
            cancelSession.mutate(sessionId, {
              onSuccess: () => {
                Alert.alert('Отменено', 'Занятие отменено');
                router.back();
              },
            });
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Stack.Screen options={{ headerShown: true, title: 'Загрузка...', headerBackTitle: 'Назад' }} />
        <View style={styles.content}>
          <Skeleton variant="card" />
          <Skeleton variant="list" />
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Stack.Screen options={{ headerShown: true, title: 'Не найдено', headerBackTitle: 'Назад' }} />
        <View style={styles.emptyCenter}>
          <Text style={styles.emptyText}>Занятие не найдено</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = session.status === 'completed';
  const isCancelled = session.status === 'cancelled';
  const canAct = !isCompleted && !isCancelled;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: session.title,
          headerBackTitle: 'Назад',
          headerStyle: { backgroundColor: colors.bg.primary },
          headerTintColor: colors.text.primary,
        }}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Session info card */}
        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Badge
              text={getSessionTypeLabel(session.type)}
              variant={getSessionBadgeVariant(session.type)}
            />
            {isCompleted && <Badge text="Завершено" variant="success" />}
            {isCancelled && <Badge text="Отменено" variant="error" />}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Время</Text>
            <Text style={styles.infoValue}>{session.time} - {session.endTime}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Место</Text>
            <Text style={styles.infoValue}>{session.location}</Text>
          </View>
        </Card>

        {/* PT-specific: client info */}
        {session.type === 'pt' && session.clientName && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Клиент</Text>
            <View style={styles.clientRow}>
              <View style={styles.clientAvatar}>
                <Text style={styles.clientAvatarText}>
                  {session.clientName.split(' ').length >= 2
                    ? getInitials(session.clientName.split(' ')[0], session.clientName.split(' ')[1])
                    : session.clientName.charAt(0)}
                </Text>
              </View>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{session.clientName}</Text>
                {session.clientPhone && (
                  <Text style={styles.clientPhone}>{session.clientPhone}</Text>
                )}
              </View>
            </View>

            <Text style={styles.notesLabel}>Заметки</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              numberOfLines={4}
              placeholder="Добавьте заметки о тренировке..."
              placeholderTextColor={colors.text.tertiary}
              value={notes || session.notes || ''}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </Card>
        )}

        {/* Group-specific: attendees */}
        {session.type === 'group' && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Участники</Text>
            <Text style={styles.attendeeCount}>
              {session.attendeeCount ?? 0} из {session.maxAttendees ?? 0} записаны
            </Text>

            {session.attendees && session.attendees.length > 0 && (
              <View style={styles.attendeeList}>
                {session.attendees.map((attendee) => (
                  <View key={attendee.id} style={styles.attendeeRow}>
                    <View style={styles.attendeeAvatar}>
                      <Text style={styles.attendeeAvatarText}>
                        {getInitials(attendee.firstName, attendee.lastName)}
                      </Text>
                    </View>
                    <Text style={styles.attendeeName}>
                      {attendee.firstName} {attendee.lastName}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        )}

        {/* SPA-specific: client info */}
        {session.type === 'spa' && session.clientName && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Клиент</Text>
            <View style={styles.clientRow}>
              <View style={styles.clientAvatar}>
                <Text style={styles.clientAvatarText}>
                  {session.clientName.split(' ').length >= 2
                    ? getInitials(session.clientName.split(' ')[0], session.clientName.split(' ')[1])
                    : session.clientName.charAt(0)}
                </Text>
              </View>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{session.clientName}</Text>
                {session.clientPhone && (
                  <Text style={styles.clientPhone}>{session.clientPhone}</Text>
                )}
              </View>
            </View>
          </Card>
        )}

        {/* Actions */}
        {canAct && (
          <View style={styles.actions}>
            <Button
              title="Отметить присутствие"
              onPress={handleMarkAttendance}
              loading={markAttendance.isPending}
            />
            <Button
              title="Отменить занятие"
              variant="danger"
              onPress={handleCancel}
              loading={cancelSession.isPending}
            />
          </View>
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
  scroll: {
    flex: 1,
  },
  content: {
    padding: SPACING[4],
    gap: SPACING[4],
    paddingBottom: SPACING[10],
  },
  infoCard: {
    gap: SPACING[3],
  },
  infoHeader: {
    flexDirection: 'row' as const,
    gap: SPACING[2],
    marginBottom: SPACING[1],
  },
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  infoLabel: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  infoValue: {
    ...t.typography.bodySm,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
  },
  sectionCard: {
    gap: SPACING[3],
  },
  sectionTitle: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
  clientRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[3],
  },
  clientAvatar: {
    width: LAYOUT.avatar.md,
    height: LAYOUT.avatar.md,
    borderRadius: LAYOUT.avatar.md / 2,
    backgroundColor: t.colors.accent.surface,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  clientAvatarText: {
    ...t.typography.bodySm,
    color: t.colors.accent.primary,
    fontWeight: '700' as const,
  },
  clientInfo: {
    flex: 1,
    gap: SPACING[1],
  },
  clientName: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
  },
  clientPhone: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  notesLabel: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    marginTop: SPACING[1],
  },
  notesInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: t.colors.border.default,
    borderRadius: t.radius.md,
    padding: SPACING[3],
    color: t.colors.text.primary,
    backgroundColor: t.colors.bg.elevated,
    ...t.typography.body,
  },
  attendeeCount: {
    ...t.typography.bodyLg,
    color: t.colors.accent.primary,
    fontWeight: '600' as const,
  },
  attendeeList: {
    gap: SPACING[2],
  },
  attendeeRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[3],
  },
  attendeeAvatar: {
    width: LAYOUT.avatar.sm,
    height: LAYOUT.avatar.sm,
    borderRadius: LAYOUT.avatar.sm / 2,
    backgroundColor: t.colors.accent.surface,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  attendeeAvatarText: {
    ...t.typography.caption,
    color: t.colors.accent.primary,
    fontWeight: '700' as const,
  },
  attendeeName: {
    ...t.typography.body,
    color: t.colors.text.primary,
  },
  actions: {
    gap: SPACING[3],
    marginTop: SPACING[2],
  },
  emptyCenter: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  emptyText: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
}));
