import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Production Backend URL (Render deployment)
const PRODUCTION_API_URL = 'https://se-15-envotix.onrender.com';

// Development: auto-detect local IP from Expo Dev Server
let DEV_API_URL = 'http://192.168.1.196:5000'; // Fallback
if (Constants.expoConfig?.hostUri) {
  const devIP = Constants.expoConfig.hostUri.split(':')[0];
  DEV_API_URL = `http://${devIP}:5000`;
}

// __DEV__ is true in Expo Go / dev mode, false in production APK
export const API_BASE_URL = __DEV__
  ? (Platform.OS === 'web' ? 'http://localhost:5000' : DEV_API_URL)
  : PRODUCTION_API_URL;

export default API_BASE_URL;