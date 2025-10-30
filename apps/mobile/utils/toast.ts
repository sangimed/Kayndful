import { Alert, Platform, ToastAndroid } from 'react-native';

export function showToast(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('', message);
  }
}

export function showSuccessToast(message: string) {
  showToast(message);
}

export function showErrorToast(message: string) {
  showToast(message);
}
