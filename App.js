import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PlasticScreen from './src/screens/plastic'; // Path matches your image

export default function App() {
  return (
    <SafeAreaProvider>
      <PlasticScreen />
    </SafeAreaProvider>
  );
}