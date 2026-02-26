import { useEffect, useCallback, useState, useMemo } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Brightness from 'expo-brightness';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING, LAYOUT } from '@/shared/theme/types';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useQRPass } from '@/features/qr/hooks';
import { useMembership } from '@/features/membership/hooks';
import { Badge, Skeleton, ErrorState } from '@/shared/ui';

// ─── Mock QR Pattern ────────────────────────────────────────────
// Generates a deterministic QR-like grid from a payload string

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function QRPattern({ payload, size }: { payload: string; size: number }) {
  const styles = useStyles();
  const gridSize = 21; // Typical QR Module count
  const cellSize = Math.floor((size - 24) / gridSize); // 24px padding inside the white square
  const gridPixelSize = cellSize * gridSize;

  // Generate a seed from payload
  const seed = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      hash = ((hash << 5) - hash) + payload.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }, [payload]);

  // Generate grid
  const cells = useMemo(() => {
    const result: boolean[][] = [];
    for (let row = 0; row < gridSize; row++) {
      result[row] = [];
      for (let col = 0; col < gridSize; col++) {
        // Corner finder patterns (3 corners: top-left, top-right, bottom-left)
        const inTopLeft = row < 7 && col < 7;
        const inTopRight = row < 7 && col >= gridSize - 7;
        const inBottomLeft = row >= gridSize - 7 && col < 7;

        if (inTopLeft || inTopRight || inBottomLeft) {
          // Finder pattern: outer border + inner square
          const localRow = inTopLeft ? row : inTopRight ? row : row - (gridSize - 7);
          const localCol = inTopLeft ? col : inTopRight ? col - (gridSize - 7) : col;
          const isOuterBorder = localRow === 0 || localRow === 6 || localCol === 0 || localCol === 6;
          const isInnerSquare = localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4;
          result[row][col] = isOuterBorder || isInnerSquare;
        } else {
          // Data area — pseudorandom
          result[row][col] = seededRandom(seed + row * gridSize + col) > 0.5;
        }
      }
    }
    return result;
  }, [seed, gridSize]);

  return (
    <View style={[styles.qrWhiteSquare, { width: size, height: size }]}>
      <View style={[styles.qrGrid, { width: gridPixelSize, height: gridPixelSize }]}>
        {cells.map((row, rowIdx) =>
          row.map((filled, colIdx) => (
            <View
              key={`${rowIdx}-${colIdx}`}
              style={[
                styles.qrCell,
                {
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: filled ? '#000000' : '#FFFFFF',
                  position: 'absolute',
                  left: colIdx * cellSize,
                  top: rowIdx * cellSize,
                },
              ]}
            />
          )),
        )}
      </View>
      {/* Center logo placeholder */}
      <View style={styles.qrCenterLogo}>
        <Text style={styles.qrCenterText}>A+</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ────────────────────────────────────────────────

export default function QRScreen() {
  useScreenView('client_qr_pass');

  const { colors } = useTheme();
  const styles = useStyles();
  const haptic = useHaptic();

  const { data: membership } = useMembership();
  const { data: qrPass, isLoading, isError, refetch, dataUpdatedAt } = useQRPass();

  const [lastRefreshTime, setLastRefreshTime] = useState<string>('');
  const [brightnessSet, setBrightnessSet] = useState(false);

  // Brightness control — max while screen is visible, restore on unmount
  useEffect(() => {
    let previousBrightness: number | undefined;

    (async () => {
      try {
        previousBrightness = await Brightness.getBrightnessAsync();
        await Brightness.setBrightnessAsync(1); // max
        setBrightnessSet(true);
      } catch {
        // Web or simulator may not support brightness
      }
    })();

    return () => {
      if (previousBrightness !== undefined) {
        Brightness.setBrightnessAsync(previousBrightness).catch(() => {});
      }
    };
  }, []);

  // Glow animation
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, // infinite
      true, // reverse
    );
  }, [glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    borderColor: colors.accent.primary,
    borderWidth: 2,
    opacity: glowOpacity.value,
  }));

  // Update refresh time when data changes
  useEffect(() => {
    if (dataUpdatedAt) {
      const date = new Date(dataUpdatedAt);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      setLastRefreshTime(`${hours}:${minutes}:${seconds}`);
      haptic.medium();
    }
  }, [dataUpdatedAt, haptic]);

  // Membership status helpers
  const membershipStatus = membership?.status ?? 'none';
  const isActive = membershipStatus === 'active';

  const statusBadge = useCallback(() => {
    switch (membershipStatus) {
      case 'active':
        return <Badge text="Активен" variant="success" />;
      case 'expired':
        return <Badge text="Истёк" variant="error" />;
      case 'frozen':
        return <Badge text="Заморожен" variant="warning" />;
      default:
        return <Badge text="Не подключён" variant="info" />;
    }
  }, [membershipStatus]);

  // ─── Inactive membership state ──────────────────────────
  if (!isActive && !isLoading) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.inactiveContainer}>
          <Text style={styles.inactiveIcon}>🔒</Text>
          <Text style={styles.inactiveTitle}>Ваш абонемент недействителен</Text>
          <Text style={styles.inactiveDescription}>
            {membershipStatus === 'expired'
              ? 'Срок действия абонемента истёк. Продлите его для доступа в клуб.'
              : membershipStatus === 'frozen'
              ? 'Ваш абонемент заморожен. Разморозьте его для доступа в клуб.'
              : 'У вас нет активного абонемента. Приобретите абонемент для доступа в клуб.'}
          </Text>
          {statusBadge()}
        </View>
      </SafeAreaView>
    );
  }

  // ─── Loading state ──────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.headerTitle}>QR-пропуск</Text>
          <View style={styles.cardContainer}>
            <Skeleton style={{ width: LAYOUT.qr.size, height: LAYOUT.qr.size, borderRadius: 16 }} />
          </View>
          <Skeleton style={{ width: 200, height: 24, marginTop: 24, borderRadius: 8 }} />
          <Skeleton style={{ width: 140, height: 16, marginTop: 8, borderRadius: 8 }} />
        </View>
      </SafeAreaView>
    );
  }

  // ─── Error state ────────────────────────────────────────
  if (isError || !qrPass) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <ErrorState message="Не удалось загрузить QR-пропуск" onRetry={() => refetch()} />
      </SafeAreaView>
    );
  }

  // ─── Active: Full QR display ────────────────────────────
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>QR-пропуск</Text>

        {/* Brightness notice — only after brightness is actually set */}
        {brightnessSet && (
          <View style={styles.brightnessNotice}>
            <Text style={styles.brightnessText}>☀️ Яркость экрана увеличена</Text>
          </View>
        )}

        {/* QR Card with glow */}
        <View style={styles.cardContainer}>
          <Animated.View style={[styles.glowBorder, glowStyle]}>
            <View style={styles.qrCard}>
              <QRPattern payload={qrPass.payload} size={LAYOUT.qr.size} />
            </View>
          </Animated.View>
        </View>

        {/* Refresh indicator */}
        <View style={styles.refreshRow}>
          <Text style={styles.refreshText}>
            Обновлено в {lastRefreshTime || '—'}
          </Text>
          <View style={[styles.refreshDot, { backgroundColor: colors.accent.primary }]} />
        </View>

        {/* Member info */}
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{qrPass.memberName}</Text>
          <Text style={styles.clubName}>{qrPass.clubName}</Text>
          <View style={styles.badgeRow}>
            {statusBadge()}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────

const useStyles = createStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center' as const,
    paddingTop: SPACING[6],
    paddingHorizontal: SPACING[4],
  },
  headerTitle: {
    ...t.typography.h2,
    color: t.colors.text.primary,
    marginBottom: SPACING[4],
  },
  brightnessNotice: {
    backgroundColor: t.colors.bg.elevated,
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[2],
    borderRadius: t.radius.sm,
    marginBottom: SPACING[6],
  },
  brightnessText: {
    ...t.typography.caption,
    color: t.colors.text.secondary,
  },

  // QR Card
  cardContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  glowBorder: {
    borderRadius: t.radius.lg + 4,
    padding: SPACING[1],
  },
  qrCard: {
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    padding: SPACING[4],
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  qrWhiteSquare: {
    backgroundColor: '#FFFFFF',
    borderRadius: t.radius.md,
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
  },
  qrGrid: {
    position: 'relative' as const,
  },
  qrCell: {
    // Sized dynamically
  },
  qrCenterLogo: {
    position: 'absolute' as const,
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  qrCenterText: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: '#000000',
    letterSpacing: -0.5,
  },

  // Refresh
  refreshRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: SPACING[4],
    gap: SPACING[2],
  },
  refreshText: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
  },
  refreshDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // Member info
  memberInfo: {
    alignItems: 'center' as const,
    marginTop: SPACING[6],
    gap: SPACING[2],
  },
  memberName: {
    ...t.typography.h3,
    color: t.colors.text.primary,
  },
  clubName: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  badgeRow: {
    marginTop: SPACING[1],
  },

  // Inactive state
  inactiveContainer: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: SPACING[8],
    gap: SPACING[4],
  },
  inactiveIcon: {
    fontSize: 64,
  },
  inactiveTitle: {
    ...t.typography.h2,
    color: t.colors.text.primary,
    textAlign: 'center' as const,
  },
  inactiveDescription: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    textAlign: 'center' as const,
    lineHeight: 22,
  },
}));
