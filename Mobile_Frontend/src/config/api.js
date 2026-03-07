// API Configuration - Change this IP to your computer's local IP address
// Find your IP: Run 'ipconfig' in terminal and look for IPv4 Address
import { Platform } from 'react-native';

const API_IP = '192.168.1.227';
const API_PORT = '5000';

// Use localhost for web, IP address for mobile devices
export const API_BASE_URL = Platform.OS === 'web' 
  ? `http://localhost:${API_PORT}` 
  : `http://${API_IP}:${API_PORT}`;

export default API_BASE_URL;