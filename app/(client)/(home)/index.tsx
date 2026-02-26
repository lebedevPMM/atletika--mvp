import { View, Text } from 'react-native';
import { createStyles } from '@/shared/theme/createStyles';

export default function HomeScreen() {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home (S1)</Text>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  container: { flex: 1, backgroundColor: t.colors.bg.primary, alignItems: 'center' as const, justifyContent: 'center' as const },
  text: { color: t.colors.text.primary, ...t.typography.h2 },
}));
