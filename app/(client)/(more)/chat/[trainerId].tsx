import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, Pressable, FlatList, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Skeleton, ErrorState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useChatMessages, useSendMessage } from '@/features/club/hooks';
import { formatMessageTime, formatMessageDate } from '@/features/club/utils';
import { SPACING } from '@/shared/theme/types';
import type { ChatMessage } from '@/features/club/types';

export default function ChatScreen() {
  useScreenView('client_chat_trainer');
  const { trainerId } = useLocalSearchParams<{ trainerId: string }>();
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();
  const flatListRef = useRef<FlatList>(null);

  const [text, setText] = useState('');

  const { data: messages, isLoading, isError, refetch } = useChatMessages(trainerId ?? '');
  const sendMessage = useSendMessage();

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages?.length]);

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || !trainerId) return;

    setText('');
    haptic.selection();
    try {
      await sendMessage.mutateAsync({ trainerId, text: trimmed });
    } catch {
      // error tracked in hook
    }
  }, [text, trainerId, haptic, sendMessage]);

  const renderMessage = useCallback(
    ({ item, index }: { item: ChatMessage; index: number }) => {
      const isMe = item.senderRole === 'client';
      const isSystem = item.senderRole === 'system';

      // Show date separator if first message or different day
      let showDate = false;
      if (index === 0) {
        showDate = true;
      } else if (messages) {
        const prevDate = new Date(messages[index - 1].createdAt).toDateString();
        const curDate = new Date(item.createdAt).toDateString();
        showDate = prevDate !== curDate;
      }

      return (
        <>
          {showDate && (
            <Text style={styles.dateSeparator}>
              {formatMessageDate(item.createdAt)}
            </Text>
          )}
          {isSystem ? (
            <View style={styles.systemMsg}>
              <Text style={styles.systemMsgText}>{item.text}</Text>
            </View>
          ) : (
            <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
              {!isMe && <Text style={styles.senderName}>{item.senderName}</Text>}
              <Text style={[styles.msgText, isMe && styles.msgTextMe]}>{item.text}</Text>
              <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>
                {formatMessageTime(item.createdAt)}
              </Text>
            </View>
          )}
        </>
      );
    },
    [messages, styles],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Чат с тренером</Text>
        </View>
        <View style={styles.loadingArea}><Skeleton variant="card" /></View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Чат с тренером</Text>
        </View>
        <ErrorState message="Не удалось загрузить сообщения" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Чат с тренером</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Сообщение..."
            placeholderTextColor={colors.text.tertiary}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
          />
          <Pressable
            onPress={handleSend}
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
            disabled={!text.trim() || sendMessage.isPending}
          >
            <Text style={styles.sendBtnText}>{'↑'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
    paddingBottom: SPACING[3],
    gap: SPACING[3],
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border.default,
  },
  headerTitle: {
    ...t.typography.h4,
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
  loadingArea: {
    flex: 1,
    padding: SPACING[4],
  },
  messagesList: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
    gap: SPACING[2],
  },
  dateSeparator: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
    textAlign: 'center' as const,
    paddingVertical: SPACING[3],
  },
  systemMsg: {
    alignSelf: 'center' as const,
    backgroundColor: t.colors.bg.surface,
    borderRadius: t.radius.md,
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[2],
    maxWidth: '80%' as unknown as number,
  },
  systemMsgText: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
    textAlign: 'center' as const,
  },
  bubble: {
    maxWidth: '75%' as unknown as number,
    borderRadius: t.radius.lg,
    padding: SPACING[3],
    gap: SPACING[1],
  },
  bubbleMe: {
    alignSelf: 'flex-end' as const,
    backgroundColor: t.colors.accent.primary,
  },
  bubbleOther: {
    alignSelf: 'flex-start' as const,
    backgroundColor: t.colors.bg.elevated,
  },
  senderName: {
    ...t.typography.caption,
    color: t.colors.accent.primary,
    fontWeight: '600' as const,
  },
  msgText: {
    ...t.typography.body,
    color: t.colors.text.primary,
  },
  msgTextMe: {
    color: t.colors.text.inverse,
  },
  msgTime: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
    alignSelf: 'flex-end' as const,
  },
  msgTimeMe: {
    color: 'rgba(0,0,0,0.5)',
  },
  inputBar: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[2],
    gap: SPACING[2],
    borderTopWidth: 1,
    borderTopColor: t.colors.border.default,
  },
  textInput: {
    flex: 1,
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
    ...t.typography.body,
    color: t.colors.text.primary,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.accent.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  sendBtnText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: t.colors.text.inverse,
  },
}));
