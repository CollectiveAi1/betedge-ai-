import { Alert, Platform } from 'react-native';

/**
 * One-line message to the user. React Native's Alert is a no-op on web, so the
 * web build falls back to window.alert — every call site was repeating that check.
 */
export function notify(message: string, title = 'BetEdge AI'): void {
  if (Platform.OS === 'web') {
    window.alert(message);
  } else {
    Alert.alert(title, message);
  }
}
