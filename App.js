import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GlassScreen from './src/screens/glass'; // Path matches your image

export default function App() {
  return (
    <SafeAreaProvider>
      <GlassScreen />
    </SafeAreaProvider>
  );
}