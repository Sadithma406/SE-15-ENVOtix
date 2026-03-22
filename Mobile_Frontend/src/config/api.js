// API Configuration dynamically handles ANY network (Wi-Fi, Hotspot)
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Automatically grabs your computer's IP from the Expo Dev server!
let API_IP = '192.168.1.196'; // Fallback IP
if (Constants.expoConfig?.hostUri) {
  API_IP = Constants.expoConfig.hostUri.split(':')[0];
}

const API_PORT = '5000';

// Use localhost for web, dynamic computer IP for mobile devices
export const API_BASE_URL = Platform.OS === 'web' 
  ? `http://localhost:${API_PORT}` 
  : `http://${API_IP}:${API_PORT}`;

export default API_BASE_URL;