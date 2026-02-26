import { useMemo } from 'react';
import { StyleSheet, type ViewStyle, type TextStyle, type ImageStyle } from 'react-native';
import { useTheme } from './useTheme';
import type { ThemeTokens } from './types';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export function createStyles<T extends NamedStyles<T>>(
  factory: (tokens: ThemeTokens) => T,
) {
  return function useStyles(): T {
    const { tokens } = useTheme();
    return useMemo(() => StyleSheet.create(factory(tokens)) as T, [tokens]);
  };
}
