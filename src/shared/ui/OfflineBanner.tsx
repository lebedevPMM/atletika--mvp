import { View, Text } from 'react-native';
import { createStyles } from '@/shared/theme/createStyles';
import { useUIStore } from '@/shared/stores/uiStore';

export function OfflineBanner() {
  const isOffline = useUIStore((s) => s.isOffline);
  const styles = useStyles();

  if (!isOffline) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>Нет подключения</Text>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  banner: {
    backgroundColor: t.colors.semantic.warning.main,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center' as const,
  },
  text: {
    ...t.typography.caption,
    color: t.colors.text.inverse,
    fontWeight: '600' as const,
  },
}));
